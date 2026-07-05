import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCustomersQuery } from './get-customers.query';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

@QueryHandler(GetCustomersQuery)
export class GetCustomersHandler implements IQueryHandler<GetCustomersQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(): Promise<CustomerEntity[]> {
    return this.customerRepo.findAll();
  }
}
