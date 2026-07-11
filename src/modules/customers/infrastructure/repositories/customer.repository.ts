import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { RequiredEntityData } from '@mikro-orm/core';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repo: EntityRepository<CustomerEntity>,
  ) {}

  findById(id: string): Promise<CustomerEntity | null> {
    return this.repo.findOne({ id, isDeleted: false });
  }

  findByPhone(phone: string): Promise<CustomerEntity | null> {
    return this.repo.findOne({ phone, isDeleted: false });
  }

  findByEmail(email: string): Promise<CustomerEntity | null> {
    return this.repo.findOne({ email, isDeleted: false });
  }

  findAll(): Promise<CustomerEntity[]> {
    return this.repo.find({ isDeleted: false }, { orderBy: { name: 'ASC' } });
  }

  async save(customer: CustomerEntity): Promise<void> {
    this.repo.getEntityManager().persist(customer);
    await this.repo.getEntityManager().flush();
  }

  create(data: Partial<CustomerEntity>): CustomerEntity {
    return this.repo.create(data as RequiredEntityData<CustomerEntity>);
  }
}
