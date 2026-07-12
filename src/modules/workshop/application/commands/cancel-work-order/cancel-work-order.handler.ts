import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CancelWorkOrderCommand } from './cancel-work-order.command';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(CancelWorkOrderCommand)
export class CancelWorkOrderHandler implements ICommandHandler<CancelWorkOrderCommand> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CancelWorkOrderCommand): Promise<void> {
    const { workOrderId, actorId } = command;

    const workOrder = await this.workOrderRepo.findById(workOrderId);
    if (!workOrder)
      throw new NotFoundException(`Work order ${workOrderId} not found`);

    workOrder.cancel();

    await this.workOrderRepo.save(workOrder);

    await this.eventBus.publishAll(workOrder.domainEvents);
    workOrder.clearDomainEvents();

    await this.auditService.log(
      'WorkOrder',
      'CANCELLED',
      { workOrderId },
      workOrderId,
      { actorId },
    );
  }
}
