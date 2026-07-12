import {
  Entity,
  Property,
  ManyToOne,
  Enum,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { WorkOrderLineType } from './work-order-line-type.enum';

@Entity({ tableName: 'work_order_lines' })
export class WorkOrderLine extends BaseEntity {
  @Enum({ items: () => WorkOrderLineType })
  type!: WorkOrderLineType;

  @Property({ type: 'string', length: 255 })
  description!: string;

  @Property({ type: 'uuid', nullable: true, fieldName: 'variant_id' })
  variantId: string | null = null;

  @Property({ type: 'uuid', nullable: true, fieldName: 'warehouse_id' })
  warehouseId: string | null = null;

  @Property({ type: 'decimal', precision: 10, scale: 3, default: 1 })
  quantity: number = 1;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    fieldName: 'unit_price',
  })
  unitPrice!: number;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    fieldName: 'line_total',
  })
  lineTotal!: number;

  @Property({ type: 'boolean', default: false })
  consumed: boolean = false;

  @Exclude()
  @ManyToOne({
    entity: () => require('./work-order.aggregate').WorkOrder,
    fieldName: 'work_order_id',
    joinColumns: ['work_order_id'],
    referencedColumnNames: ['id'],
  })
  workOrder!: Rel<any>;
}
