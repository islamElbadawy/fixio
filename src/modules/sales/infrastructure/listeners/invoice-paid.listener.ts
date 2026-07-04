import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { InvoicePaidEvent } from '../../domain/events/invoice-paid.event';
import { ConfirmReservationCommand } from '../../../inventory/application/commands/confirm-reservation/confirm-reservation.command';
import { ReleaseReservationCommand } from '../../../inventory/application/commands/release-reservation/release-reservation.command';

@Injectable()
export class InvoicePaidListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('sales.invoice_paid')
  async handle(event: InvoicePaidEvent): Promise<void> {
    for (const line of event.lines) {
      try {
        if (line.reservationId) {
          await this.commandBus.execute(
            new ConfirmReservationCommand(
              { reservationId: line.reservationId },
              'system',
            ),
          );
        }
      } catch (error) {
        console.error(
          `[Sales] Failed to confirm reservation ${line.reservationId}: ${error.message}`,
        );
      }
    }
  }
}
