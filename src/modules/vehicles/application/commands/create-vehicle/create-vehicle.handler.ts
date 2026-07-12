import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateVehicleCommand } from './create-vehicle.command';
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from '../../../domain/repositories/vehicle.repository.interface';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../../customers/domain/repositories/customer.repository.interface';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';

@CommandHandler(CreateVehicleCommand)
export class CreateVehicleHandler implements ICommandHandler<CreateVehicleCommand> {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: IVehicleRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(command: CreateVehicleCommand): Promise<VehicleEntity> {
    const { dto } = command;

    const existing = await this.vehicleRepo.findByLicensePlate(
      dto.licensePlate,
    );
    if (existing) {
      throw new ConflictException(
        `License plate ${dto.licensePlate} already registered`,
      );
    }

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${dto.customerId} not found`);
    }

    const vehicle = this.vehicleRepo.create({
      make: dto.make,
      model: dto.model,
      year: dto.year,
      licensePlate: dto.licensePlate,
      vin: dto.vin ?? null,
      color: dto.color ?? null,
      mileage: dto.mileage ?? 0,
      customer,
    });

    await this.vehicleRepo.save(vehicle);
    return vehicle;
  }
}
