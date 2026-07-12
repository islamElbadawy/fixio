import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RecordPartConsumptionCommand } from './record-part-consumption.command';
import {
  IWorkOrderRepository,
  WORK_ORDER_REPOSITORY,
} from '../../../domain/repositories/work-order.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';

@CommandHandler(RecordPartConsumptionCommand)
export class RecordPartConsumptionHandler implements ICommandHandler<RecordPartConsumptionCommand> {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepo: IWorkOrderRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: RecordPartConsumptionCommand): Promise<void> {
    const { workOrderId, dto, actorId } = command;

    const workOrder = await this.workOrderRepo.findById(workOrderId, true);
    if (!workOrder)
      throw new NotFoundException(`Work order ${workOrderId} not found`);

    workOrder.recordPartConsumption(dto.lineId, actorId);

    await this.workOrderRepo.save(workOrder);

    await this.eventBus.publishAll(workOrder.domainEvents);
    workOrder.clearDomainEvents();

    await this.auditService.log(
      'WorkOrder',
      'PART_CONSUMED',
      { workOrderId, lineId: dto.lineId },
      workOrderId,
      { actorId },
    );
  }
}
