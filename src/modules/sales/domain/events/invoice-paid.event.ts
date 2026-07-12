import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class InvoicePaidEvent extends DomainEvent {
  readonly eventName = 'sales.invoice_paid';

  constructor(
    public readonly invoiceId: string,
    public readonly orderId: string,
    public readonly lines: Array<{
      variantId: string;
      warehouseId: string;
      quantity: number;
      reservationId: string;
    }>,
  ) {
    super();
  }
}
