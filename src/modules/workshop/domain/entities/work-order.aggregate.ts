import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Enum,
  Index,
  PrimaryKey,
} from '@mikro-orm/decorators/legacy';
import { Collection, Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { generateId } from '../../../shared/infrastructure/database/uuid.util';
import { AggregateRootBase } from '../../../shared/infrastructure/database/aggregate-root.base';
import { WorkOrderStatus } from './work-order-status.enum';
import { WorkOrderLineType } from './work-order-line-type.enum';
import { WorkOrderLine } from './work-order-line.entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import {
  WorkOrderNotDraftException,
  WorkOrderNotInProgressException,
  WorkOrderAlreadyCompletedException,
  WorkOrderCancelledException,
  EmptyWorkOrderException,
  PartAlreadyConsumedException,
} from '../exceptions/work-order.exceptions';
import { WorkOrderStartedEvent } from '../events/work-order-started.event';
import { WorkOrderCompletedEvent } from '../events/work-order-completed.event';
import { WorkOrderCancelledEvent } from '../events/work-order-cancelled.event';
import { PartConsumedEvent } from '../events/part-consumed.event';
import { VehicleEntity } from 'src/modules/vehicles/domain/entities/vehicle.entity';
import { CustomerEntity } from 'src/modules/customers/domain/entities/customer.entity';

@Entity({ tableName: 'work_orders' })
export class WorkOrder extends AggregateRootBase {
  @PrimaryKey({ type: 'uuid' })
  id: string = generateId();

  @Index({ name: 'idx_work_orders_number' })
  @Property({
    type: 'string',
    length: 50,
    unique: true,
    fieldName: 'work_order_number',
  })
  workOrderNumber!: string;

  @ManyToOne(() => VehicleEntity, { fieldName: 'vehicle_id' })
  vehicle!: Rel<VehicleEntity>;

  @ManyToOne(() => CustomerEntity, { fieldName: 'customer_id' })
  customer!: Rel<CustomerEntity>;

  @ManyToOne(() => CustomerEntity, {
    fieldName: 'technician_id',
    nullable: true,
  })
  technician: Rel<CustomerEntity> | null = null;

  @Enum({ items: () => WorkOrderStatus, default: WorkOrderStatus.DRAFT })
  status: WorkOrderStatus = WorkOrderStatus.DRAFT;

  @Property({ type: 'text', nullable: true })
  diagnosis: string | null = null;

  @Property({ type: 'text', nullable: true })
  notes: string | null = null;

  @Property({ type: 'integer', nullable: true, fieldName: 'mileage_in' })
  mileageIn: number | null = null;

  @Property({ type: 'integer', nullable: true, fieldName: 'mileage_out' })
  mileageOut: number | null = null;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'total_amount',
  })
  totalAmount: number = 0;

  @Property({ type: 'boolean', default: false, fieldName: 'is_deleted' })
  isDeleted: boolean = false;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'deleted_at' })
  deletedAt: Date | null = null;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'started_at' })
  startedAt: Date | null = null;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'completed_at' })
  completedAt: Date | null = null;

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
  @OneToMany(() => WorkOrderLine, (l) => l.workOrder, { eager: false })
  lines = new Collection<WorkOrderLine>(this);

  // ─── Factory ──────────────────────────────────────────────

  static create(
    workOrderNumber: string,
    vehicle: VehicleEntity,
    customer: CustomerEntity,
    mileageIn?: number,
    notes?: string,
    diagnosis?: string,
  ): WorkOrder {
    const wo = new WorkOrder();
    wo.workOrderNumber = workOrderNumber;
    wo.vehicle = vehicle;
    wo.customer = customer;
    wo.mileageIn = mileageIn ?? null;
    wo.notes = notes ?? null;
    wo.diagnosis = diagnosis ?? null;
    return wo;
  }

  // ─── Business methods ─────────────────────────────────────

  addLine(
    type: WorkOrderLineType,
    description: string,
    unitPrice: number,
    quantity: number = 1,
    variantId?: string,
    warehouseId?: string,
  ): WorkOrderLine {
    if (this.status === WorkOrderStatus.CANCELLED) {
      throw new WorkOrderCancelledException(this.id);
    }

    if (this.status === WorkOrderStatus.COMPLETED) {
      throw new WorkOrderAlreadyCompletedException(this.id);
    }

    if (type === WorkOrderLineType.PART && (!variantId || !warehouseId)) {
      throw new DomainException('PART lines require variantId and warehouseId');
    }

    if (unitPrice < 0) {
      throw new DomainException('Unit price cannot be negative');
    }

    const line = new WorkOrderLine();
    line.id = generateId();
    line.type = type;
    line.description = description;
    line.variantId = variantId ?? null;
    line.warehouseId = warehouseId ?? null;
    line.quantity = quantity;
    line.unitPrice = unitPrice;
    line.lineTotal = Math.round(quantity * unitPrice * 100) / 100;
    line.workOrder = this as any;

    this.lines.add(line);
    this.recalculateTotal();

    return line;
  }

  start(technicianId: string): void {
    if (this.status === WorkOrderStatus.CANCELLED) {
      throw new WorkOrderCancelledException(this.id);
    }

    if (this.status !== WorkOrderStatus.DRAFT) {
      throw new WorkOrderNotDraftException(this.id);
    }

    this.status = WorkOrderStatus.IN_PROGRESS;
    this.startedAt = new Date();

    this.addDomainEvent(
      new WorkOrderStartedEvent(
        this.id,
        (this.vehicle as any).id,
        technicianId,
      ),
    );
  }

  recordPartConsumption(lineId: string, technicianId: string): WorkOrderLine {
    if (this.status !== WorkOrderStatus.IN_PROGRESS) {
      throw new WorkOrderNotInProgressException(this.id);
    }

    const line = this.lines.getItems().find((l) => l.id === lineId);
    if (!line) {
      throw new DomainException(
        `Line ${lineId} not found on work order ${this.id}`,
      );
    }

    if (line.type !== WorkOrderLineType.PART) {
      throw new DomainException(
        `Line ${lineId} is a SERVICE line — only PART lines can be consumed`,
      );
    }

    if (line.consumed) {
      throw new PartAlreadyConsumedException(lineId);
    }

    line.consumed = true;

    this.addDomainEvent(
      new PartConsumedEvent(
        this.id,
        lineId,
        line.variantId!,
        line.warehouseId!,
        Number(line.quantity),
        technicianId,
      ),
    );

    return line;
  }

  complete(mileageOut?: number): void {
    if (this.status === WorkOrderStatus.CANCELLED) {
      throw new WorkOrderCancelledException(this.id);
    }

    if (this.status !== WorkOrderStatus.IN_PROGRESS) {
      throw new WorkOrderNotInProgressException(this.id);
    }

    const loadedLines = this.lines.getItems();
    if (loadedLines.length === 0) {
      throw new EmptyWorkOrderException(this.id);
    }

    this.status = WorkOrderStatus.COMPLETED;
    this.completedAt = new Date();
    if (mileageOut) this.mileageOut = mileageOut;

    this.addDomainEvent(
      new WorkOrderCompletedEvent(
        this.id,
        (this.vehicle as any).id,
        (this.customer as any).id,
        Number(this.totalAmount),
        loadedLines.map((l) => ({
          type: l.type,
          description: l.description,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
          variantId: l.variantId,
          warehouseId: l.warehouseId,
        })),
      ),
    );
  }

  cancel(): void {
    if (this.status === WorkOrderStatus.COMPLETED) {
      throw new WorkOrderAlreadyCompletedException(this.id);
    }

    if (this.status === WorkOrderStatus.CANCELLED) {
      throw new WorkOrderCancelledException(this.id);
    }

    this.status = WorkOrderStatus.CANCELLED;
    this.isDeleted = true;
    this.deletedAt = new Date();

    this.addDomainEvent(
      new WorkOrderCancelledEvent(this.id, (this.vehicle as any).id),
    );
  }

  private recalculateTotal(): void {
    this.totalAmount = this.lines
      .getItems()
      .reduce((sum, l) => sum + Number(l.lineTotal), 0);
    this.totalAmount = Math.round(this.totalAmount * 100) / 100;
  }
}
