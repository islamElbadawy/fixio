import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Enum,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Collection, Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { AggregateRootBase } from '../../../shared/infrastructure/database/aggregate-root.base';
import { OrderStatus } from './order-status.enum';
import { SalesOrderLine } from './sales-order-line.entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import {
  OrderAlreadyConfirmedException,
  OrderCancelledException,
  EmptyOrderException,
  OrderAlreadyInvoicedException,
} from '../exceptions/order.exceptions';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';
import { OrderCancelledEvent } from '../events/order-cancelled.event';
import { CustomerEntity } from 'src/modules/customers/domain/entities/customer.entity';

@Entity({ tableName: 'sales_orders' })
export class SalesOrder extends AggregateRootBase {
  @Property({ type: 'uuid' })
  id: string = uuidv4();

  @Index({ name: 'idx_orders_number' })
  @Property({
    type: 'string',
    length: 50,
    unique: true,
    fieldName: 'order_number',
  })
  orderNumber!: string;

  @ManyToOne(() => CustomerEntity, { fieldName: 'customer_id' })
  customer!: Rel<CustomerEntity>;

  @Enum({ items: () => OrderStatus, default: OrderStatus.DRAFT })
  status: OrderStatus = OrderStatus.DRAFT;

  @Property({ type: 'text', nullable: true })
  notes: string | null = null;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'total_amount',
  })
  totalAmount: number = 0;

  @Property({ type: 'uuid', nullable: true, fieldName: 'work_order_id' })
  workOrderId: string | null = null;

  @Property({ type: 'boolean', default: false, fieldName: 'is_deleted' })
  isDeleted: boolean = false;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'deleted_at' })
  deletedAt: Date | null = null;

  @Property({
    type: 'timestamptz',
    fieldName: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;

  @Exclude()
  @OneToMany(() => SalesOrderLine, (l) => l.order, { eager: false })
  lines = new Collection<SalesOrderLine>(this);

  // ─── Factory ──────────────────────────────────────────────

  static create(
    customer: CustomerEntity,
    orderNumber: string,
    notes?: string,
    workOrderId?: string,
  ): SalesOrder {
    const order = new SalesOrder();
    order.customer = customer;
    order.orderNumber = orderNumber;
    order.notes = notes ?? null;
    order.workOrderId = workOrderId ?? null;
    return order;
  }

  // ─── Business methods ─────────────────────────────────────

  addLine(
    variantId: string,
    warehouseId: string,
    quantity: number,
    unitPrice: number,
  ): SalesOrderLine {
    if (this.status !== OrderStatus.DRAFT) {
      throw new OrderAlreadyConfirmedException(this.id);
    }

    if (quantity <= 0) {
      throw new DomainException('Quantity must be greater than zero');
    }

    if (unitPrice < 0) {
      throw new DomainException('Unit price cannot be negative');
    }

    const line = new SalesOrderLine();
    line.id = uuidv4();
    line.variantId = variantId;
    line.warehouseId = warehouseId;
    line.quantity = quantity;
    line.unitPrice = unitPrice;
    line.lineTotal = Math.round(quantity * unitPrice * 100) / 100;
    line.order = this;

    this.lines.add(line);
    this.recalculateTotal();

    return line;
  }

  confirm(): void {
    if (this.status === OrderStatus.CANCELLED) {
      throw new OrderCancelledException(this.id);
    }

    if (
      this.status === OrderStatus.CONFIRMED ||
      this.status === OrderStatus.INVOICED
    ) {
      throw new OrderAlreadyConfirmedException(this.id);
    }

    const loadedLines = this.lines.getItems();
    if (loadedLines.length === 0) {
      throw new EmptyOrderException(this.id);
    }

    this.status = OrderStatus.CONFIRMED;

    this.addDomainEvent(
      new OrderConfirmedEvent(
        this.id,
        (this.customer as any).id,
        loadedLines.map((l) => ({
          variantId: l.variantId,
          warehouseId: l.warehouseId,
          quantity: Number(l.quantity),
        })),
      ),
    );
  }

  markAsInvoiced(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new OrderAlreadyInvoicedException(this.id);
    }
    this.status = OrderStatus.INVOICED;
  }

  cancel(): void {
    if (this.status === OrderStatus.CANCELLED) {
      throw new OrderCancelledException(this.id);
    }

    if (this.status === OrderStatus.INVOICED) {
      throw new DomainException(
        `Order ${this.id} is already invoiced and cannot be cancelled`,
      );
    }

    const reservationIds = this.lines
      .getItems()
      .filter((l) => l.reservationId !== null)
      .map((l) => l.reservationId as string);

    this.status = OrderStatus.CANCELLED;
    this.isDeleted = true;
    this.deletedAt = new Date();

    this.addDomainEvent(new OrderCancelledEvent(this.id, reservationIds));
  }

  setLineReservation(lineId: string, reservationId: string): void {
    const line = this.lines.getItems().find((l) => l.id === lineId);
    if (line) line.reservationId = reservationId;
  }

  private recalculateTotal(): void {
    this.totalAmount = this.lines
      .getItems()
      .reduce((sum, l) => sum + Number(l.lineTotal), 0);
    this.totalAmount = Math.round(this.totalAmount * 100) / 100;
  }
}
