import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { PartConsumedEvent } from '../../domain/events/part-consumed.event';
import { AdjustStockCommand } from '../../../inventory/application/commands/adjust-stock/adjust-stock.command';
import { TransactionType } from '../../../inventory/domain/entities/transaction-type.enum';

@Injectable()
export class PartConsumedListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('workshop.part_consumed')
  async handle(event: PartConsumedEvent): Promise<void> {
    try {
      await this.commandBus.execute(
        new AdjustStockCommand(
          {
            variantId: event.variantId,
            warehouseId: event.warehouseId,
            quantity: event.quantity,
            type: TransactionType.WORKSHOP_USAGE,
            notes: `Workshop usage — Work Order line ${event.lineId}`,
          },
          event.technicianId,
        ),
      );
    } catch (error) {
      console.error(
        `[Workshop] Failed to record stock usage for variant ${event.variantId}: ${error.message}`,
      );
    }
  }
}
