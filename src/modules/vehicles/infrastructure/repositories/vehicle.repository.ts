import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { RequiredEntityData } from '@mikro-orm/core';
import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly repo: EntityRepository<VehicleEntity>,
  ) {}

  findById(id: string): Promise<VehicleEntity | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      { populate: ['customer'] },
    );
  }

  findByLicensePlate(plate: string): Promise<VehicleEntity | null> {
    return this.repo.findOne(
      { licensePlate: plate, isDeleted: false },
      { populate: ['customer'] },
    );
  }

  findByCustomer(customerId: string): Promise<VehicleEntity[]> {
    return this.repo.find(
      { customer: { id: customerId }, isDeleted: false },
      { populate: ['customer'], orderBy: { make: 'ASC' } },
    );
  }

  findAll(): Promise<VehicleEntity[]> {
    return this.repo.find(
      { isDeleted: false },
      { populate: ['customer'], orderBy: { make: 'ASC' } },
    );
  }

  async save(vehicle: VehicleEntity): Promise<void> {
    this.repo.getEntityManager().persist(vehicle);
    await this.repo.getEntityManager().flush();
  }

  create(data: Partial<VehicleEntity>): VehicleEntity {
    return this.repo.create(data as RequiredEntityData<VehicleEntity>);
  }
}
