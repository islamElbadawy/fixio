import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class OrderConfirmedEvent extends DomainEvent {
  readonly eventName = 'sales.order_confirmed';

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly lines: Array<{
      variantId: string;
      warehouseId: string;
      quantity: number;
    }>,
  ) {
    super();
  }
}
