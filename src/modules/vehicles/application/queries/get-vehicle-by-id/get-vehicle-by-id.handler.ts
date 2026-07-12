import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVehicleByIdQuery } from './get-vehicle-by-id.query';
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from '../../../domain/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';

@QueryHandler(GetVehicleByIdQuery)
export class GetVehicleByIdHandler implements IQueryHandler<GetVehicleByIdQuery> {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: IVehicleRepository,
  ) {}

  async execute(query: GetVehicleByIdQuery): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepo.findById(query.id);
    if (!vehicle) throw new NotFoundException(`Vehicle ${query.id} not found`);
    return vehicle;
  }
}
