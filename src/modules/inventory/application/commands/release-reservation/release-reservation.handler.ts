import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ReleaseReservationCommand } from './release-reservation.command';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../../../domain/repositories/stock.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(ReleaseReservationCommand)
export class ReleaseReservationHandler implements ICommandHandler<ReleaseReservationCommand> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: ReleaseReservationCommand): Promise<void> {
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

    stock.releaseReservation(dto.reservationId);

    await this.stockRepo.saveReservations(
      stock.domainEvents.filter(() => true).map(() => reservation),
    );

    await this.eventBus.publishAll(stock.domainEvents);
    stock.clearDomainEvents();

    await this.auditService.log(
      'Inventory',
      'RESERVATION_RELEASED',
      { reservationId: dto.reservationId },
      dto.reservationId,
      { actorId },
    );
  }
}
