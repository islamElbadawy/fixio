import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVehiclesQuery } from './get-vehicles.query';
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from '../../../domain/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';

@QueryHandler(GetVehiclesQuery)
export class GetVehiclesHandler implements IQueryHandler<GetVehiclesQuery> {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: IVehicleRepository,
  ) {}

  async execute(query: GetVehiclesQuery): Promise<VehicleEntity[]> {
    if (query.customerId) {
      return this.vehicleRepo.findByCustomer(query.customerId);
    }
    return this.vehicleRepo.findAll();
  }
}
