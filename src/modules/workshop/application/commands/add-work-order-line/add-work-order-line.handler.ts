import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AddWorkOrderLineCommand } from './add-work-order-line.command';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import { WorkOrderLine } from '../../../domain/entities/work-order-line.entity';

@CommandHandler(AddWorkOrderLineCommand)
export class AddWorkOrderLineHandler implements ICommandHandler<AddWorkOrderLineCommand> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
  ) {}

  async execute(command: AddWorkOrderLineCommand): Promise<WorkOrderLine> {
    const { workOrderId, dto } = command;

    const workOrder = await this.workOrderRepo.findById(workOrderId, true);
    if (!workOrder)
      throw new NotFoundException(`Work order ${workOrderId} not found`);

    const line = workOrder.addLine(
      dto.type,
      dto.description,
      dto.unitPrice,
      dto.quantity ?? 1,
      dto.variantId,
      dto.warehouseId,
    );

    await this.workOrderRepo.save(workOrder);
    return line;
  }
}
