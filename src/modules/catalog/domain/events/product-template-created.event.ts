import { DomainEvent } from '../../../shared/domain/events/domain-event.base';

export class ProductTemplateCreatedEvent extends DomainEvent {
  readonly eventName = 'catalog.product_template_created';

  constructor(
    public readonly templateId: string,
    public readonly name: string,
    public readonly categoryId: string,
  ) {
    super(`product-template-created-${templateId}`, new Date());
  }
}
