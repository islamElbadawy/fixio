import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { VehicleEntity } from './domain/entities/vehicle.entity';
import { VehicleRepository } from './infrastructure/repositories/vehicle.repository';
import { VEHICLE_REPOSITORY } from './domain/repositories/vehicle.repository.interface';
import { VehiclesController } from './presentation/vehicles.controller';

import { CreateVehicleHandler } from './application/commands/create-vehicle/create-vehicle.handler';
import { UpdateVehicleHandler } from './application/commands/update-vehicle/update-vehicle.handler';
import { GetVehiclesHandler } from './application/queries/get-vehicles/get-vehicles.handler';
import { GetVehicleByIdHandler } from './application/queries/get-vehicle-by-id/get-vehicle-by-id.handler';

import { CustomersModule } from '../customers/customers.module';

const CommandHandlers = [CreateVehicleHandler, UpdateVehicleHandler];
const QueryHandlers = [GetVehiclesHandler, GetVehicleByIdHandler];

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([VehicleEntity]),
    CustomersModule,
  ],
  controllers: [VehiclesController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: VEHICLE_REPOSITORY, useClass: VehicleRepository },
  ],
  exports: [VEHICLE_REPOSITORY, CqrsModule],
})
export class VehiclesModule {}
