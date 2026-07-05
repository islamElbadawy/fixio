import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { ReserveStockCommand } from '../../../inventory/application/commands/reserve-stock/reserve-stock.command';

@Injectable()
export class OrderConfirmedListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('sales.order_confirmed')
  async handle(event: OrderConfirmedEvent): Promise<void> {
    for (const line of event.lines) {
      try {
        await this.commandBus.execute(
          new ReserveStockCommand(
            {
              variantId: line.variantId,
              warehouseId: line.warehouseId,
              quantity: line.quantity,
              referenceId: event.orderId,
              referenceType: 'SALES_ORDER',
            },
            'system',
          ),
        );
      } catch (error) {
        console.error(
          `[Sales] Failed to reserve stock for variant ${line.variantId}: ${error.message}`,
        );
      }
    }
  }
}