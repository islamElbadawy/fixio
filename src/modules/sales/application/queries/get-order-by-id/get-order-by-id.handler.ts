import { QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import { ISalesOrderRepository } from 'src/modules/sales/domain/repositories/sales-order.repository.interface';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler {
  constructor(private readonly salesOrderRepo: ISalesOrderRepository) {}

  async execute(query: GetOrderByIdQuery) {
    const orderId = query.id;
    return this.salesOrderRepo.findById(orderId);
  }
}
