import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { WarehouseEntity } from './domain/entities/warehouse.entity';
import { InventoryTransactionEntity } from './domain/entities/inventory-transaction.entity';
import { StockReservationEntity } from './domain/entities/stock-reservation.entity';

import { WarehouseRepository } from './infrastructure/repositories/warehouse.repository';
import { StockRepository } from './infrastructure/repositories/stock.repository';

import { WAREHOUSE_REPOSITORY } from './domain/repositories/warehouse.repository.interface';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';

import { InventoryController } from './presentation/inventory.controller';

import { CreateWarehouseHandler } from './application/commands/create-warehouse/create-warehouse.handler';
import { ReceiveStockHandler } from './application/commands/receive-stock/receive-stock.handler';
import { AdjustStockHandler } from './application/commands/adjust-stock/adjust-stock.handler';
import { ReserveStockHandler } from './application/commands/reserve-stock/reserve-stock.handler';
import { ReleaseReservationHandler } from './application/commands/release-reservation/release-reservation.handler';
import { ConfirmReservationHandler } from './application/commands/confirm-reservation/confirm-reservation.handler';

import { GetWarehousesHandler } from './application/queries/get-warehouses/get-warehouses.handler';
import { GetStockLevelHandler } from './application/queries/get-stock-level/get-stock-level.handler';
import { GetStockMovementsHandler } from './application/queries/get-stock-movements/get-stock-movements.handler';
import { ProductVariantCreatedListener } from './infrastructure/listeners/product-variant-created.listener';

const CommandHandlers = [
  CreateWarehouseHandler,
  ReceiveStockHandler,
  AdjustStockHandler,
  ReserveStockHandler,
  ReleaseReservationHandler,
  ConfirmReservationHandler,
];

const QueryHandlers = [
  GetWarehousesHandler,
  GetStockLevelHandler,
  GetStockMovementsHandler,
];

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([
      WarehouseEntity,
      InventoryTransactionEntity,
      StockReservationEntity,
    ]),
  ],
  controllers: [InventoryController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseRepository },
    { provide: STOCK_REPOSITORY, useClass: StockRepository },
    ProductVariantCreatedListener,
  ],
  exports: [WAREHOUSE_REPOSITORY, STOCK_REPOSITORY, CqrsModule],
})
export class InventoryModule {}
