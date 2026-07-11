import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class StockReservedEvent extends DomainEvent {
  readonly eventName = 'inventory.stock_reserved';

  constructor(
    public readonly variantId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly reservationId: string,
    public readonly referenceId: string | null,
    public readonly referenceType: string | null,
  ) {
    super();
  }
}
