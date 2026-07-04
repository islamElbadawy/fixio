import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AddOrderLineCommand } from './add-order-line.command';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from '../../../domain/repositories/sales-order.repository.interface';
import { SalesOrderLine } from '../../../domain/entities/sales-order-line.entity';

@CommandHandler(AddOrderLineCommand)
export class AddOrderLineHandler implements ICommandHandler<AddOrderLineCommand> {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly orderRepo: ISalesOrderRepository,
  ) {}

  async execute(command: AddOrderLineCommand): Promise<SalesOrderLine> {
    const { orderId, dto } = command;

    const order = await this.orderRepo.findById(orderId, true);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const line = order.addLine(
      dto.variantId,
      dto.warehouseId,
      dto.quantity,
      dto.unitPrice,
    );

    await this.orderRepo.save(order);
    return line;
  }
}
