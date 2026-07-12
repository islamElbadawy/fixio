import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { ReleaseReservationCommand } from '../../../inventory/application/commands/release-reservation/release-reservation.command';

@Injectable()
export class OrderCancelledListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('sales.order_cancelled')
  async handle(event: OrderCancelledEvent): Promise<void> {
    for (const reservationId of event.reservationIds) {
      try {
        await this.commandBus.execute(
          new ReleaseReservationCommand({ reservationId }, 'system'),
        );
      } catch (error) {
        console.error(
          `[Sales] Failed to release reservation ${reservationId}: ${error.message}`,
        );
      }
    }
  }
}
