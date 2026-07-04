import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class OrderCancelledEvent extends DomainEvent {
  readonly eventName = 'sales.order_cancelled';

  constructor(
    public readonly orderId: string,
    public readonly reservationIds: string[],
  ) {
    super();
  }
}
