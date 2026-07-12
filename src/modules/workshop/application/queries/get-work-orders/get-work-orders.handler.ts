import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkOrdersQuery } from './get-work-orders.query';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import { WorkOrder } from '../../../domain/entities/work-order.aggregate';

@QueryHandler(GetWorkOrdersQuery)
export class GetWorkOrdersHandler implements IQueryHandler<GetWorkOrdersQuery> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
  ) {}

  async execute(query: GetWorkOrdersQuery): Promise<WorkOrder[]> {
    return this.workOrderRepo.findAll(query.vehicleId);
  }
}
