import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  ManyToOne,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { generateId } from '../../../shared/infrastructure/database/uuid.util';
import { TransactionType } from './transaction-type.enum';
import { WarehouseEntity } from './warehouse.entity';

@Entity({ tableName: 'inventory_transactions' })
@Index({ properties: ['variantId', 'warehouse'] })
@Index({ properties: ['variantId', 'type'] })
export class InventoryTransactionEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = generateId();

  @Index()
  @Property({ type: 'uuid', fieldName: 'variant_id' })
  variantId!: string;

  @ManyToOne(() => WarehouseEntity, { fieldName: 'warehouse_id' })
  warehouse!: Rel<WarehouseEntity>;

  @Enum({ items: () => TransactionType })
  type!: TransactionType;

  @Property({ type: 'decimal', precision: 10, scale: 3 })
  quantity!: number;

  @Property({ type: 'uuid', nullable: true, fieldName: 'reference_id' })
  referenceId: string | null = null;

  @Property({ type: 'string', length: 100, nullable: true, fieldName: 'reference_type' })
  referenceType: string | null = null;

  @Property({ type: 'text', nullable: true })
  notes: string | null = null;

  @Property({ type: 'uuid', nullable: true, fieldName: 'actor_id' })
  actorId: string | null = null;

  @Property({ type: 'timestamptz', fieldName: 'created_at', onCreate: () => new Date() })
  createdAt: Date = new Date();
}