import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetWorkOrderByIdQuery } from './get-work-order-by-id.query';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import { WorkOrder } from '../../../domain/entities/work-order.aggregate';

@QueryHandler(GetWorkOrderByIdQuery)
export class GetWorkOrderByIdHandler implements IQueryHandler<GetWorkOrderByIdQuery> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
  ) {}

  async execute(query: GetWorkOrderByIdQuery): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepo.findById(query.id, true);
    if (!workOrder)
      throw new NotFoundException(`Work order ${query.id} not found`);
    return workOrder;
  }
}
