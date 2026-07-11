import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class PartConsumedEvent extends DomainEvent {
  readonly eventName = 'workshop.part_consumed';

  constructor(
    public readonly workOrderId: string,
    public readonly lineId: string,
    public readonly variantId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly technicianId: string,
  ) {
    super();
  }
}
