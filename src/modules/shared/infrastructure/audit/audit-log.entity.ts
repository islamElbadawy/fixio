import {
  Entity,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'audit_logs' })
@Index({ properties: ['entityType', 'entityId'] })
@Index({ properties: ['actorId'] })
export class AuditLogEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'uuid', nullable: true })
  actorId: string | null = null;

  @Property({ length: 50, nullable: true })
  actorRole: string | null = null;

  @Property({ length: 100 })
  entityType!: string;

  @Property({ type: 'uuid', nullable: true })
  entityId: string | null = null;

  @Property({ length: 100 })
  action!: string;

  @Property({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null = null;

  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt: Date = new Date();
}
