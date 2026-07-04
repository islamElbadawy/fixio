import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateCustomerCommand } from './update-customer.command';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../domain/repositories/customer.repository.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<CustomerEntity> {
    const { id, dto, actorId } = command;

    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);

    if (dto.phone && dto.phone !== customer.phone) {
      const existing = await this.customerRepo.findByPhone(dto.phone);
      if (existing)
        throw new ConflictException(`Phone ${dto.phone} already registered`);
      customer.phone = dto.phone;
    }

    if (dto.email && dto.email !== customer.email) {
      const existing = await this.customerRepo.findByEmail(dto.email);
      if (existing)
        throw new ConflictException(`Email ${dto.email} already registered`);
      customer.email = dto.email;
    }

    if (dto.name) customer.name = dto.name;
    if (dto.address !== undefined) customer.address = dto.address ?? null;
    if (dto.creditLimit !== undefined) customer.creditLimit = dto.creditLimit;
    if (dto.isActive !== undefined) customer.isActive = dto.isActive;

    await this.customerRepo.save(customer);

    await this.auditService.log(
      'Customer',
      'UPDATED',
      dto as Record<string, unknown>,
      id,
      { actorId },
    );

    return customer;
  }
}
