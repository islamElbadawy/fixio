import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class ProductVariantUpdatedEvent extends DomainEvent {
  readonly eventName = 'catalog.product_variant_updated';

  constructor(
    public readonly templateId: string,
    public readonly variantId: string,
    public readonly changes: Record<string, unknown>,
  ) {
    super(`product-variant-updated-${variantId}`, new Date());
  }
}
