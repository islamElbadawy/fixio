import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateOrderCommand } from './create-order.command';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from '../../../domain/repositories/sales-order.repository.interface';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../../customers/domain/repositories/customer.repository.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { SalesOrder } from '../../../domain/entities/sales-order.aggregate';
import { generateOrderNumber } from '../../utils/number-generator.util';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly orderRepo: ISalesOrderRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<SalesOrder> {
    const { dto, actorId } = command;

    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer)
      throw new NotFoundException(`Customer ${dto.customerId} not found`);

    const lastNumber = await this.orderRepo.findLastOrderNumber();
    const orderNumber = generateOrderNumber(lastNumber);

    const order = SalesOrder.create(
      customer,
      orderNumber,
      dto.notes,
      dto.workOrderId,
    );

    if (dto.lines && dto.lines.length > 0) {
      for (const line of dto.lines) {
        order.addLine(
          line.variantId,
          line.warehouseId,
          line.quantity,
          line.unitPrice,
        );
      }
    }

    await this.orderRepo.save(order);

    await this.auditService.log(
      'SalesOrder',
      'CREATED',
      { orderNumber, customerId: dto.customerId },
      order.id,
      { actorId },
    );

    return order;
  }
}
