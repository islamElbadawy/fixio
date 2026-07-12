import {
  Entity,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { WarehouseEntity } from './warehouse.entity';

@Entity({ tableName: 'stock_reservations' })
@Index({ properties: ['variantId', 'warehouse'] })
export class StockReservationEntity extends BaseEntity {
  @Index()
  @Property({ type: 'uuid', fieldName: 'variant_id' })
  variantId!: string;

  @ManyToOne(() => WarehouseEntity, { fieldName: 'warehouse_id' })
  warehouse!: Rel<WarehouseEntity>;

  @Property({ type: 'decimal', precision: 10, scale: 3 })
  quantity!: number;

  @Property({ type: 'uuid', nullable: true, fieldName: 'reference_id' })
  referenceId: string | null = null;

  @Property({ type: 'string', length: 100, nullable: true, fieldName: 'reference_type' })
  referenceType: string | null = null;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'expires_at' })
  expiresAt: Date | null = null;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;
}