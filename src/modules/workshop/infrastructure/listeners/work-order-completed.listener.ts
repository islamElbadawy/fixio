import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { WorkOrderCompletedEvent } from '../../domain/events/work-order-completed.event';
import { CreateOrderCommand } from '../../../sales/application/commands/create-order/create-order.command';
import { WorkOrderLineType } from '../../domain/entities/work-order-line-type.enum';

@Injectable()
export class WorkOrderCompletedListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('workshop.work_order_completed')
  async handle(event: WorkOrderCompletedEvent): Promise<void> {
    try {
      await this.commandBus.execute(
        new CreateOrderCommand(
          {
            customerId: event.customerId,
            workOrderId: event.workOrderId,
            notes: `Auto-generated from Work Order — Workshop`,
            lines: event.lines.map((l) => ({
              variantId: l.variantId ?? '00000000-0000-0000-0000-000000000000',
              warehouseId:
                l.warehouseId ?? '00000000-0000-0000-0000-000000000000',
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
          'system',
        ),
      );
    } catch (error) {
      console.error(
        `[Workshop] Failed to create sales order for work order ${event.workOrderId}: ${error.message}`,
      );
    }
  }
}
