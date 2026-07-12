import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { CreateCustomerCommand } from './create-customer.command';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../../../domain/repositories/customer.repository.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<CustomerEntity> {
    const { dto, actorId } = command;

    const existingPhone = await this.customerRepo.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictException(`Phone ${dto.phone} is already registered`);
    }

    if (dto.email) {
      const existingEmail = await this.customerRepo.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException(`Email ${dto.email} is already registered`);
      }
    }

    const customer = this.customerRepo.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? null,
      address: dto.address ?? null,
      creditLimit: dto.creditLimit ?? 0,
    });

    await this.customerRepo.save(customer);

    await this.auditService.log(
      'Customer',
      'CREATED',
      { name: dto.name, phone: dto.phone },
      customer.id,
      { actorId },
    );

    return customer;
  }
}