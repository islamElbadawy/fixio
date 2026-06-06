import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class ProductVariantRemovedEvent extends DomainEvent {
  readonly eventName = 'catalog.product_variant_removed';

  constructor(
    public readonly templateId: string,
    public readonly variantId: string,
    public readonly sku: string,
  ) {
    super(`product-variant-removed-${variantId}`, new Date());
  }
}
