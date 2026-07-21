import { generateId } from '../../infrastructure/database/uuid.util';

export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  abstract readonly eventName: string;

  constructor() {
    this.eventId = generateId();
    this.occurredAt = new Date();
  }
}
