import { DomainEvent } from '../../../shared/domain/events/domain-event.base';
import { TransactionType } from '../entities/transaction-type.enum';

export class StockAdjustedEvent extends DomainEvent {
  readonly eventName = 'inventory.stock_adjusted';

  constructor(
    public readonly variantId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly type: TransactionType,
    public readonly transactionId: string,
  ) {
    super();
  }
}