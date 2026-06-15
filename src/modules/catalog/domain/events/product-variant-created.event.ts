import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class ProductVariantCreatedEvent extends DomainEvent {
  readonly eventName = 'catalog.product_variant_created';

  constructor(
    public readonly templateId: string,
    public readonly variantId: string,
    public readonly sku: string,
    public readonly purchasePrice: number,
    public readonly sellingPrice: number,
  ) {
    super();
  }
}
