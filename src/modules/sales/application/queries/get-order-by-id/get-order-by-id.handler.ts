import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from '../../../domain/repositories/sales-order.repository.interface';
import { SalesOrder } from '../../../domain/entities/sales-order.aggregate';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly orderRepo: ISalesOrderRepository,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<SalesOrder> {
    const order = await this.orderRepo.findById(query.id, true);
    if (!order) throw new NotFoundException(`Order ${query.id} not found`);
    return order;
  }
}
