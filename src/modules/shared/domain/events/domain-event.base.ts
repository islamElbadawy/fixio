export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  abstract readonly eventName: string;

  constructor(eventId: string, occurredAt: Date) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
  }
}
