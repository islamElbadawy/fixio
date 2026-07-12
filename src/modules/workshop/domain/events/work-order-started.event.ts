import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class WorkOrderStartedEvent extends DomainEvent {
  readonly eventName = 'workshop.work_order_started';

  constructor(
    public readonly workOrderId: string,
    public readonly vehicleId: string,
    public readonly technicianId: string,
  ) {
    super();
  }
}
