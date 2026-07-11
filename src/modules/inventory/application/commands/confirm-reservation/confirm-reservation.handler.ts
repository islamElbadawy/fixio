import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ConfirmReservationCommand } from './confirm-reservation.command';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../../../domain/repositories/stock.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { InventoryTransactionEntity } from '../../../domain/entities/inventory-transaction.entity';

@CommandHandler(ConfirmReservationCommand)
export class ConfirmReservationHandler implements ICommandHandler<ConfirmReservationCommand> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    command: ConfirmReservationCommand,
  ): Promise<InventoryTransactionEntity> {
    const { dto, actorId } = command;

    const reservation = await this.stockRepo.findReservationById(
      dto.reservationId,
    );
    if (!reservation) {
      throw new NotFoundException(`Reservation ${dto.reservationId} not found`);
    }

    const stock = await this.stockRepo.load(
      reservation.variantId,
      reservation.warehouse.id,
    );

    const transaction = stock.confirmReservation(dto.reservationId, actorId);

    await this.stockRepo.saveReservations([reservation]);
    await this.stockRepo.saveTransactions([transaction]);

    await this.eventBus.publishAll(stock.domainEvents);
    stock.clearDomainEvents();

    await this.auditService.log(
      'Inventory',
      'RESERVATION_CONFIRMED',
      {
        reservationId: dto.reservationId,
        variantId: reservation.variantId,
        quantity: reservation.quantity,
      },
      transaction.id,
      { actorId },
    );

    return transaction;
  }
}
