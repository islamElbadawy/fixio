import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class ReservationReleasedEvent extends DomainEvent {
  readonly eventName = 'inventory.reservation_released';

  constructor(
    public readonly reservationId: string,
    public readonly variantId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
  ) {
    super();
  }
}