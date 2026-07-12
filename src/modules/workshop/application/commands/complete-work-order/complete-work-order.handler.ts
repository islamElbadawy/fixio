import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CompleteWorkOrderCommand } from './complete-work-order.command';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(CompleteWorkOrderCommand)
export class CompleteWorkOrderHandler implements ICommandHandler<CompleteWorkOrderCommand> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: CompleteWorkOrderCommand): Promise<void> {
    const { workOrderId, dto, actorId } = command;

    const workOrder = await this.workOrderRepo.findById(workOrderId, true);
    if (!workOrder)
      throw new NotFoundException(`Work order ${workOrderId} not found`);

    if (!workOrder.lines.isInitialized()) {
      workOrder.lines.set(
        (await (this.workOrderRepo as any).lineRepo?.find({
          workOrder: { id: workOrderId },
        })) ?? [],
      );
    }

    workOrder.complete(dto.mileageOut);

    await this.workOrderRepo.save(workOrder);

    await this.eventBus.publishAll(workOrder.domainEvents);
    workOrder.clearDomainEvents();

    await this.auditService.log(
      'WorkOrder',
      'COMPLETED',
      { workOrderId, totalAmount: workOrder.totalAmount },
      workOrderId,
      { actorId },
    );
  }
}
