import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ConfirmOrderCommand } from './confirm-order.command';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from '../../../domain/repositories/sales-order.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly orderRepo: ISalesOrderRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    const { orderId, actorId } = command;

    const order = await this.orderRepo.findById(orderId, true);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    order.confirm();

    await this.orderRepo.save(order);

    await this.eventBus.publishAll(order.domainEvents);
    order.clearDomainEvents();

    await this.auditService.log(
      'SalesOrder',
      'CONFIRMED',
      { orderId, totalAmount: order.totalAmount },
      orderId,
      { actorId },
    );
  }
}
