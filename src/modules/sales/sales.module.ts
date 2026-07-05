import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { SalesOrder } from './domain/entities/sales-order.aggregate';
import { SalesOrderLine } from './domain/entities/sales-order-line.entity';
import { Invoice } from './domain/entities/invoice.aggregate';
import { Payment } from './domain/entities/payment.entity';

import { SalesOrderRepository } from './infrastructure/repositories/sales-order.repository';
import { InvoiceRepository } from './infrastructure/repositories/invoice.repository';

import { SALES_ORDER_REPOSITORY } from './domain/repositories/sales-order.repository.interface';
import { INVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';

import { SalesController } from './presentation/sales.controller';

import { CreateOrderHandler } from './application/commands/create-order/create-order.handler';
import { AddOrderLineHandler } from './application/commands/add-order-line/add-order-line.handler';
import { ConfirmOrderHandler } from './application/commands/confirm-order/confirm-order.handler';
import { GenerateInvoiceHandler } from './application/commands/generate-invoice/generate-invoice.handler';
import { RecordPaymentHandler } from './application/commands/record-payment/record-payment.handler';
import { CancelOrderHandler } from './application/commands/cancel-order/cancel-order.handler';

import { GetOrdersHandler } from './application/queries/get-orders/get-orders.handler';
import { GetOrderByIdHandler } from './application/queries/get-order-by-id/get-order-by-id.handler';
import { GetInvoicesHandler } from './application/queries/get-invoices/get-invoices.handler';
import { GetInvoiceByIdHandler } from './application/queries/get-invoice-by-id/get-invoice-by-id.handler';

import { OrderConfirmedListener } from './infrastructure/listeners/order-confirmed.listener';
import { InvoicePaidListener } from './infrastructure/listeners/invoice-paid.listener';
import { OrderCancelledListener } from './infrastructure/listeners/order-cancelled.listener';

import { CustomersModule } from '../customers/customers.module';
import { InventoryModule } from '../inventory/inventory.module';

const CommandHandlers = [
  CreateOrderHandler,
  AddOrderLineHandler,
  ConfirmOrderHandler,
  GenerateInvoiceHandler,
  RecordPaymentHandler,
  CancelOrderHandler,
];

const QueryHandlers = [
  GetOrdersHandler,
  GetOrderByIdHandler,
  GetInvoicesHandler,
  GetInvoiceByIdHandler,
];

const Listeners = [
  OrderConfirmedListener,
  InvoicePaidListener,
  OrderCancelledListener,
];

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([
      SalesOrder,
      SalesOrderLine,
      Invoice,
      Payment,
    ]),
    CustomersModule,
    InventoryModule,
  ],
  controllers: [SalesController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...Listeners,
    { provide: SALES_ORDER_REPOSITORY, useClass: SalesOrderRepository },
    { provide: INVOICE_REPOSITORY,     useClass: InvoiceRepository },
  ],
  exports: [
    SALES_ORDER_REPOSITORY,
    INVOICE_REPOSITORY,
    CqrsModule,
  ],
})
export class SalesModule {}