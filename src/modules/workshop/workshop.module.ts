import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { WorkOrder } from './domain/entities/work-order.aggregate';
import { WorkOrderLine } from './domain/entities/work-order-line.entity';

import { WorkOrderRepository } from './infrastructure/repositories/work-order.repository';
import { WORK_ORDER_REPOSITORY } from './domain/repositories/work-order.repository.interface';

import { WorkshopController } from './presentation/workshop.controller';

import { CreateWorkOrderHandler } from './application/commands/create-work-order/create-work-order.handler';
import { AddWorkOrderLineHandler } from './application/commands/add-work-order-line/add-work-order-line.handler';
import { StartWorkOrderHandler } from './application/commands/start-work-order/start-work-order.handler';
import { RecordPartConsumptionHandler } from './application/commands/record-part-consumption/record-part-consumption.handler';
import { CompleteWorkOrderHandler } from './application/commands/complete-work-order/complete-work-order.handler';
import { CancelWorkOrderHandler } from './application/commands/cancel-work-order/cancel-work-order.handler';

import { GetWorkOrdersHandler } from './application/queries/get-work-orders/get-work-orders.handler';
import { GetWorkOrderByIdHandler } from './application/queries/get-work-order-by-id/get-work-order-by-id.handler';
import { GetVehicleWorkOrdersHandler } from './application/queries/get-vehicle-work-orders/get-vehicle-work-orders.handler';

import { PartConsumedListener } from './infrastructure/listeners/part-consumed.listener';
import { WorkOrderCompletedListener } from './infrastructure/listeners/work-order-completed.listener';

import { VehiclesModule } from '../vehicles/vehicles.module';
import { CustomersModule } from '../customers/customers.module';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesModule } from '../sales/sales.module';

const CommandHandlers = [
  CreateWorkOrderHandler,
  AddWorkOrderLineHandler,
  StartWorkOrderHandler,
  RecordPartConsumptionHandler,
  CompleteWorkOrderHandler,
  CancelWorkOrderHandler,
];

const QueryHandlers = [
  GetWorkOrdersHandler,
  GetWorkOrderByIdHandler,
  GetVehicleWorkOrdersHandler,
];

const Listeners = [PartConsumedListener, WorkOrderCompletedListener];

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([WorkOrder, WorkOrderLine]),
    VehiclesModule,
    CustomersModule,
    InventoryModule,
    SalesModule,
  ],
  controllers: [WorkshopController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...Listeners,
    { provide: WORK_ORDER_REPOSITORY, useClass: WorkOrderRepository },
  ],
  exports: [WORK_ORDER_REPOSITORY, CqrsModule],
})
export class WorkshopModule {}
