import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class StockReceivedEvent extends DomainEvent {
  readonly eventName = 'inventory.stock_received';

  constructor(
    public readonly variantId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly transactionId: string,
    public readonly referenceId: string | null,
  ) {
    super();
  }
}