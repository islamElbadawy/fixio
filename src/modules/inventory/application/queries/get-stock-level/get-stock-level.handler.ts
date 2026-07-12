import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetStockLevelQuery } from './get-stock-level.query';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../../../domain/repositories/stock.repository.interface';
import {
  IWarehouseRepository,
  WAREHOUSE_REPOSITORY,
} from '../../../domain/repositories/warehouse.repository.interface';

export interface StockLevelResult {
  variantId: string;
  warehouseId: string;
  warehouseName: string;
  onHand: number;
  reserved: number;
  available: number;
}

@QueryHandler(GetStockLevelQuery)
export class GetStockLevelHandler implements IQueryHandler<GetStockLevelQuery> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepo: IWarehouseRepository,
  ) {}

  async execute(query: GetStockLevelQuery): Promise<StockLevelResult> {
    const warehouse = await this.warehouseRepo.findById(query.warehouseId);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse ${query.warehouseId} not found`);
    }

    const level = await this.stockRepo.getStockLevel(
      query.variantId,
      query.warehouseId,
    );

    return {
      variantId: query.variantId,
      warehouseId: query.warehouseId,
      warehouseName: warehouse.name,
      ...level,
    };
  }
}
