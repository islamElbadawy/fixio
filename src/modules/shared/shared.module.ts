import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { AuditLogEntity } from './infrastructure/audit/audit-log.entity';
import { AuditService } from './infrastructure/audit/audit.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DOMAIN_EVENT_BUS } from './contracts/domain-event-bus.interface';
import { DomainEvent } from './domain/events/domain-event.base';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    MikroOrmModule.forFeature([AuditLogEntity]),
  ],
  providers: [
    AuditService,
    {
      provide: DOMAIN_EVENT_BUS,
      useFactory: (emitter) => ({
        async publish(event: DomainEvent): Promise<void> {
          emitter.emit(event.eventName, event);
        },
        async publishAll(events: DomainEvent[]): Promise<void> {
          for (const event of events) {
            emitter.emit(event.eventName, event);
          }
        },
      }),
      inject: [EventEmitter2],
    },
  ],
  exports: [AuditService, DOMAIN_EVENT_BUS],
})
export class SharedModule {}
