import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { AuditLogEntity } from './audit-log.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

export interface AuditContext {
  actorId?: string;
  actorRole?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly repo: EntityRepository<AuditLogEntity>,
  ) {}

  async log(
    entityType: string,
    action: string,
    payload: Record<string, unknown> | null,
    entityId?: string,
    ctx?: AuditContext,
  ): Promise<void> {
    const entry = this.repo.create({
      entityType,
      entityId: entityId ?? null,
      action,
      payload: payload ?? null,
      actorId: ctx?.actorId ?? null,
      actorRole: ctx?.actorRole ?? null,
      createdAt: new Date(),
    });
    this.repo.getEntityManager().persist(entry);
    await this.repo.getEntityManager().flush();
  }
}
