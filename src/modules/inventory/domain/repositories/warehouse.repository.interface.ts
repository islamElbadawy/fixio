import { WarehouseEntity } from '../entities/warehouse.entity';

export const WAREHOUSE_REPOSITORY = Symbol('IWarehouseRepository');

export interface IWarehouseRepository {
  findById(id: string): Promise<WarehouseEntity | null>;
  findAll(): Promise<WarehouseEntity[]>;
  save(warehouse: WarehouseEntity): Promise<void>;
  create(data: Partial<WarehouseEntity>): WarehouseEntity;
}
