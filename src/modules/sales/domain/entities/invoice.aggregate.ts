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
import { v4 as uuidv4 } from 'uuid';
import { AggregateRootBase } from '../../../shared/infrastructure/database/aggregate-root.base';
import { SalesOrder } from './sales-order.aggregate';
import { Payment } from './payment.entity';
import { InvoiceStatus } from './invoice-status.enum';
import { PaymentMethod } from './payment-method.enum';
import {
  InvoiceAlreadyPaidException,
  OverpaymentException,
} from '../exceptions/order.exceptions';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { InvoicePaidEvent } from '../events/invoice-paid.event';
import { CustomerEntity } from 'src/modules/customers/domain/entities/customer.entity';

@Entity({ tableName: 'invoices' })
export class Invoice extends AggregateRootBase {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Index({ name: 'idx_invoices_number' })
  @Property({
    type: 'string',
    length: 50,
    unique: true,
    fieldName: 'invoice_number',
  })
  invoiceNumber!: string;

  @ManyToOne(() => CustomerEntity, { fieldName: 'customer_id' })
  customer!: Rel<CustomerEntity>;

  @Exclude()
  @ManyToOne(() => SalesOrder, { fieldName: 'order_id' })
  order!: Rel<SalesOrder>;

  @Enum({ items: () => InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus = InvoiceStatus.UNPAID;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    fieldName: 'total_amount',
  })
  totalAmount!: number;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'paid_amount',
  })
  paidAmount: number = 0;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'remaining_amount',
  })
  remainingAmount: number = 0;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'due_date' })
  dueDate: Date | null = null;

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
  @OneToMany(() => Payment, (p) => p.invoice, { eager: false })
  payments = new Collection<Payment>(this);

  // ─── Factory ──────────────────────────────────────────────

  static create(
    invoiceNumber: string,
    order: SalesOrder,
    customer: CustomerEntity,
    totalAmount: number,
    dueDate?: Date,
  ): Invoice {
    const invoice = new Invoice();
    invoice.invoiceNumber = invoiceNumber;
    invoice.order = order;
    invoice.customer = customer;
    invoice.totalAmount = totalAmount;
    invoice.remainingAmount = totalAmount;
    invoice.dueDate = dueDate ?? null;
    return invoice;
  }

  // ─── Business methods ─────────────────────────────────────

  recordPayment(
    amount: number,
    method: PaymentMethod,
    actorId: string,
    notes?: string,
  ): Payment {
    if (this.status === InvoiceStatus.PAID) {
      throw new InvoiceAlreadyPaidException(this.id);
    }

    if (this.status === InvoiceStatus.CANCELLED) {
      throw new DomainException(`Invoice ${this.id} is cancelled`);
    }

    if (amount <= 0) {
      throw new DomainException('Payment amount must be greater than zero');
    }

    if (amount > this.remainingAmount) {
      throw new OverpaymentException(this.id, amount, this.remainingAmount);
    }

    const payment = new Payment();
    payment.id = uuidv4();
    payment.amount = amount;
    payment.method = method;
    payment.actorId = actorId;
    payment.notes = notes ?? null;
    payment.invoice = this as unknown as Rel<Invoice>;

    this.payments.add(payment);

    this.paidAmount =
      Math.round((Number(this.paidAmount) + amount) * 100) / 100;
    this.remainingAmount =
      Math.round((Number(this.remainingAmount) - amount) * 100) / 100;

    if (this.remainingAmount <= 0) {
      this.status = InvoiceStatus.PAID;
      this.remainingAmount = 0;

      const order = this.order as any;

      this.addDomainEvent(
        new InvoicePaidEvent(
          this.id,
          order.id,
          [], // lines resolved by listener from order ID
        ),
      );
    } else {
      this.status = InvoiceStatus.PARTIAL;
    }

    return payment;
  }

  cancel(): void {
    if (this.status === InvoiceStatus.PAID) {
      throw new DomainException(
        `Invoice ${this.id} is fully paid and cannot be cancelled`,
      );
    }
    this.status = InvoiceStatus.CANCELLED;
    this.isDeleted = true;
    this.deletedAt = new Date();
  }
}
