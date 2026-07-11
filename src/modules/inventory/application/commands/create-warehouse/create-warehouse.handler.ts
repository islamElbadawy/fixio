import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateWarehouseCommand } from './create-warehouse.command';
import {
  IWarehouseRepository,
  WAREHOUSE_REPOSITORY,
} from '../../../domain/repositories/warehouse.repository.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { WarehouseEntity } from '../../../domain/entities/warehouse.entity';

@CommandHandler(CreateWarehouseCommand)
export class CreateWarehouseHandler implements ICommandHandler<CreateWarehouseCommand> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepo: IWarehouseRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CreateWarehouseCommand): Promise<WarehouseEntity> {
    const { dto, actorId } = command;

    const warehouse = this.warehouseRepo.create({
      name: dto.name,
      location: dto.location ?? null,
    });

    await this.warehouseRepo.save(warehouse);

    await this.auditService.log(
      'Warehouse',
      'CREATED',
      { name: dto.name, location: dto.location },
      warehouse.id,
      { actorId },
    );

    return warehouse;
  }
}
