import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { AuditLogEntity } from './audit-log.entity';

export interface AuditContext {
  actorId?: string;
  actorRole?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly em: EntityManager) {}

  async log(
    entityType: string,
    action: string,
    payload: Record<string, unknown> | null,
    entityId?: string,
    ctx?: AuditContext,
  ): Promise<void> {
    const entry = this.em.create(AuditLogEntity, {
      entityType,
      entityId: entityId ?? null,
      action,
      payload: payload ?? null,
      actorId: ctx?.actorId ?? null,
      actorRole: ctx?.actorRole ?? null,
      createdAt: new Date(),
    });
    this.em.persist(entry);
    await this.em.flush();
  }
}
