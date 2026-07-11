import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateVehicleCommand } from './update-vehicle.command';
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from '../../../domain/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler implements ICommandHandler<UpdateVehicleCommand> {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: IVehicleRepository,
  ) {}

  async execute(command: UpdateVehicleCommand): Promise<VehicleEntity> {
    const { id, dto } = command;

    const vehicle = await this.vehicleRepo.findById(id);
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);

    if (dto.licensePlate && dto.licensePlate !== vehicle.licensePlate) {
      const existing = await this.vehicleRepo.findByLicensePlate(
        dto.licensePlate,
      );
      if (existing) {
        throw new ConflictException(
          `License plate ${dto.licensePlate} already registered`,
        );
      }
      vehicle.licensePlate = dto.licensePlate;
    }

    if (dto.make) vehicle.make = dto.make;
    if (dto.model) vehicle.model = dto.model;
    if (dto.year) vehicle.year = dto.year;
    if (dto.vin !== undefined) vehicle.vin = dto.vin ?? null;
    if (dto.color !== undefined) vehicle.color = dto.color ?? null;
    if (dto.mileage !== undefined) vehicle.mileage = dto.mileage;

    await this.vehicleRepo.save(vehicle);
    return vehicle;
  }
}
