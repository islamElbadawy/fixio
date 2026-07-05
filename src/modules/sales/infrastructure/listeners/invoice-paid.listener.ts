import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InvoicePaidEvent } from '../../domain/events/invoice-paid.event';
import { ConfirmReservationCommand } from '../../../inventory/application/commands/confirm-reservation/confirm-reservation.command';
import { GetOrderByIdQuery } from '../../application/queries/get-order-by-id/get-order-by-id.query';
import { SalesOrder } from '../../domain/entities/sales-order.aggregate';

@Injectable()
export class InvoicePaidListener {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @OnEvent('sales.invoice_paid')
  async handle(event: InvoicePaidEvent): Promise<void> {
    const order: SalesOrder = await this.queryBus.execute(
      new GetOrderByIdQuery(event.orderId),
    );

    const lines = order.lines.getItems();

    for (const line of lines) {
      if (!line.reservationId) continue;
      try {
        await this.commandBus.execute(
          new ConfirmReservationCommand(
            { reservationId: line.reservationId },
            'system',
          ),
        );
      } catch (error) {
        console.error(
          `[Sales] Failed to confirm reservation ${line.reservationId}: ${error.message}`,
        );
      }
    }
  }
}
