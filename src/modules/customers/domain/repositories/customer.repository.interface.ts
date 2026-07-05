import { CustomerEntity } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  findById(id: string): Promise<CustomerEntity | null>;
  findByPhone(phone: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  findAll(): Promise<CustomerEntity[]>;
  save(customer: CustomerEntity): Promise<void>;
  create(data: Partial<CustomerEntity>): CustomerEntity;
}
