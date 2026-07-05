import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { RequiredEntityData } from '@mikro-orm/core';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly repo: EntityRepository<WarehouseEntity>,
  ) {}

  findById(id: string): Promise<WarehouseEntity | null> {
    return this.repo.findOne({ id, isDeleted: false });
  }

  findAll(): Promise<WarehouseEntity[]> {
    return this.repo.find({ isDeleted: false }, { orderBy: { name: 'ASC' } });
  }

  async save(warehouse: WarehouseEntity): Promise<void> {
    this.repo.getEntityManager().persist(warehouse);
    await this.repo.getEntityManager().flush();
  }

  create(data: Partial<WarehouseEntity>): WarehouseEntity {
    return this.repo.create(data as RequiredEntityData<WarehouseEntity>);
  }
}
