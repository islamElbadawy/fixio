import {
  Entity,
  Property,
  PrimaryKey,
  Index,
} from '@mikro-orm/decorators/legacy';
import { generateId } from '../database/uuid.util';

@Entity({ tableName: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = generateId();

  @Index({ name: 'idx_audit_actor' })
  @Property({ type: 'uuid', nullable: true, fieldName: 'actor_id' })
  actorId: string | null = null;

  @Property({
    type: 'string',
    length: 50,
    nullable: true,
    fieldName: 'actor_role',
  })
  actorRole: string | null = null;

  @Property({ type: 'string', length: 100, fieldName: 'entity_type' })
  entityType!: string;

  @Index({ name: 'idx_audit_entity' })
  @Property({ type: 'uuid', nullable: true, fieldName: 'entity_id' })
  entityId: string | null = null;

  @Property({ type: 'string', length: 100 })
  action!: string;

  @Property({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null = null;

  @Property({ type: 'timestamptz', fieldName: 'created_at' })
  createdAt: Date = new Date();
}
