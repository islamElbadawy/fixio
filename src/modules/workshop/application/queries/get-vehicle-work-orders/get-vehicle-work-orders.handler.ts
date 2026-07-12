import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVehicleWorkOrdersQuery } from './get-vehicle-work-orders.query';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import { WorkOrder } from '../../../domain/entities/work-order.aggregate';

@QueryHandler(GetVehicleWorkOrdersQuery)
export class GetVehicleWorkOrdersHandler implements IQueryHandler<GetVehicleWorkOrdersQuery> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
  ) {}

  async execute(query: GetVehicleWorkOrdersQuery): Promise<WorkOrder[]> {
    return this.workOrderRepo.findByVehicle(query.vehicleId);
  }
}
