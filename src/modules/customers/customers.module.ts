import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { CustomerEntity } from './domain/entities/customer.entity';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository.interface';
import { CustomersController } from './presentation/customers.controller';

import { CreateCustomerHandler } from './application/commands/create-customer/create-customer.handler';
import { UpdateCustomerHandler } from './application/commands/update-customer/update-customer.handler';
import { GetCustomersHandler } from './application/queries/get-customers/get-customers.handler';
import { GetCustomerByIdHandler } from './application/queries/get-customer-by-id/get-customer-by-id.handler';

const CommandHandlers = [CreateCustomerHandler, UpdateCustomerHandler];
const QueryHandlers = [GetCustomersHandler, GetCustomerByIdHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  ],
  exports: [CUSTOMER_REPOSITORY, CqrsModule],
})
export class CustomersModule {}
