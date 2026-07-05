import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ReceiveStockCommand } from './receive-stock.command';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../../../domain/repositories/stock.repository.interface';
import {
  IWarehouseRepository,
  WAREHOUSE_REPOSITORY,
} from '../../../domain/repositories/warehouse.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { InventoryTransactionEntity } from '../../../domain/entities/inventory-transaction.entity';

@CommandHandler(ReceiveStockCommand)
export class ReceiveStockHandler implements ICommandHandler<ReceiveStockCommand> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepo: IWarehouseRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    command: ReceiveStockCommand,
  ): Promise<InventoryTransactionEntity> {
    const { dto, actorId } = command;

    const warehouse = await this.warehouseRepo.findById(dto.warehouseId);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse ${dto.warehouseId} not found`);
    }

    const stock = await this.stockRepo.load(dto.variantId, dto.warehouseId);

    const transaction = stock.receiveStock(
      dto.quantity,
      dto.referenceId ?? null,
      dto.referenceType ?? null,
      dto.notes ?? null,
      actorId,
    );

    await this.stockRepo.saveTransactions([transaction]);

    await this.eventBus.publishAll(stock.domainEvents);
    stock.clearDomainEvents();

    await this.auditService.log(
      'Inventory',
      'STOCK_RECEIVED',
      {
        variantId: dto.variantId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        referenceId: dto.referenceId,
      },
      transaction.id,
      { actorId },
    );

    return transaction;
  }
}
