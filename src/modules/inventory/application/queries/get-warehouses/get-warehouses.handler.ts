import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWarehousesQuery } from './get-warehouses.query';
import {
  IWarehouseRepository,
  WAREHOUSE_REPOSITORY,
} from '../../../domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '../../../domain/entities/warehouse.entity';

@QueryHandler(GetWarehousesQuery)
export class GetWarehousesHandler implements IQueryHandler<GetWarehousesQuery> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepo: IWarehouseRepository,
  ) {}

  async execute(): Promise<WarehouseEntity[]> {
    return this.warehouseRepo.findAll();
  }
}
