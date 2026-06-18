import { Exclude } from 'class-transformer';
import { DomainEvent } from '../../domain/events/domain-event.base';

export abstract class AggregateRootBase {
  @Exclude()
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return [...(this._domainEvents ?? [])];
  }

  protected addDomainEvent(event: DomainEvent): void {
    if (!this._domainEvents) {
      this._domainEvents = [];
    }
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
