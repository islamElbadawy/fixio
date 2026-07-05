import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ReserveStockCommand } from './reserve-stock.command';
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
import { StockReservationEntity } from '../../../domain/entities/stock-reservation.entity';

@CommandHandler(ReserveStockCommand)
export class ReserveStockHandler implements ICommandHandler<ReserveStockCommand> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepo: IWarehouseRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: ReserveStockCommand): Promise<StockReservationEntity> {
    const { dto, actorId } = command;

    const warehouse = await this.warehouseRepo.findById(dto.warehouseId);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse ${dto.warehouseId} not found`);
    }

    const stock = await this.stockRepo.load(dto.variantId, dto.warehouseId);

    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;

    const reservation = stock.reserve(
      dto.quantity,
      dto.referenceId ?? null,
      dto.referenceType ?? null,
      expiresAt,
      actorId,
    );

    await this.stockRepo.saveReservations([reservation]);

    await this.eventBus.publishAll(stock.domainEvents);
    stock.clearDomainEvents();

    await this.auditService.log(
      'Inventory',
      'STOCK_RESERVED',
      {
        variantId: dto.variantId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        referenceId: dto.referenceId,
      },
      reservation.id,
      { actorId },
    );

    return reservation;
  }
}
