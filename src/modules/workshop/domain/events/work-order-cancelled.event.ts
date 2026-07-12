import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class WorkOrderCancelledEvent extends DomainEvent {
  readonly eventName = 'workshop.work_order_cancelled';

  constructor(
    public readonly workOrderId: string,
    public readonly vehicleId: string,
  ) {
    super();
  }
}
