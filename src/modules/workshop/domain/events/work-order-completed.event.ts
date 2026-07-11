import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class WorkOrderCompletedEvent extends DomainEvent {
  readonly eventName = 'workshop.work_order_completed';

  constructor(
    public readonly workOrderId: string,
    public readonly vehicleId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly lines: Array<{
      type: string;
      description: string;
      quantity: number;
      unitPrice: number;
      variantId: string | null;
      warehouseId: string | null;
    }>,
  ) {
    super();
  }
}
