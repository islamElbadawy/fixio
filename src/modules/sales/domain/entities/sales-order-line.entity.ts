import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';

@Entity({ tableName: 'sales_order_lines' })
export class SalesOrderLine extends BaseEntity {
  @Property({ type: 'uuid', fieldName: 'variant_id' })
  variantId!: string;

  @Property({ type: 'uuid', fieldName: 'warehouse_id' })
  warehouseId!: string;

  @Property({ type: 'decimal', precision: 10, scale: 3 })
  quantity!: number;

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

  @Property({ type: 'uuid', nullable: true, fieldName: 'reservation_id' })
  reservationId: string | null = null;

  @Exclude()
  @ManyToOne({
    entity: () => require('./sales-order.aggregate').SalesOrder,
    fieldName: 'order_id',
    joinColumns: ['order_id'],
    referencedColumnNames: ['id'],
  })
  order!: Rel<any>;
}
