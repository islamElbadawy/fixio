import { QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import { ISalesOrderRepository } from 'src/modules/sales/domain/repositories/sales-order.repository.interface';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler {
  constructor(private readonly salesOrderRepo: ISalesOrderRepository) {}

  async execute(query: GetOrderByIdQuery) {
    const orderId = query.id;
    const order = await this.salesOrderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Sales order with ID ${orderId} not found`);
    }

    return order;
  }
}
