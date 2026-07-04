import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { GetInvoicesQuery } from '../get-invoices/get-invoices.query';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from 'src/modules/sales/domain/repositories/sales-order.repository.interface';

@QueryHandler(GetInvoicesQuery)
export class GetInvoicesHandler {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly salesOrders: ISalesOrderRepository,
  ) {}

  async execute(query: GetInvoicesQuery) {
    const customerId = query.customerId;
    return this.salesOrders.findAll(customerId);
  }
}
