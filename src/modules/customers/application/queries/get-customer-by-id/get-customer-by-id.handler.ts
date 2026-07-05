import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCustomerByIdQuery } from './get-customer-by-id.query';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler implements IQueryHandler<GetCustomerByIdQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(query: GetCustomerByIdQuery): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findById(query.id);
    if (!customer)
      throw new NotFoundException(`Customer ${query.id} not found`);
    return customer;
  }
}
