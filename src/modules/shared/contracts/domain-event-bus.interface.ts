import { DomainEvent } from '../domain/events/domain-event.base';

export const DOMAIN_EVENT_BUS = Symbol('IDOMAIN_EVENT_BUS');

export interface IDomainEventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
