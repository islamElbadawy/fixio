import {
  Entity,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { ProductTemplateEntity } from './product-template.entity';

@Entity({ tableName: 'product_variants' })
export class ProductVariantEntity extends BaseEntity {
  @Index({ name: 'idx_variants_sku' })
  @Property({ length: 100, unique: true })
  sku!: string;

  @Property({ length: 150, nullable: true })
  name: string | null = null;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    fieldName: 'purchase_price',
  })
  purchasePrice!: number;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    fieldName: 'selling_price',
  })
  sellingPrice!: number;

  @Property({
    type: 'jsonb',
    nullable: true,
    default: '{}',
  })
  specs: Record<string, unknown> = {};

  @Property({
    default: true,
    fieldName: 'is_active',
  })
  isActive: boolean = true;

  @Property({
    length: 10,
    nullable: true,
  })
  unit: string | null = null;

  @ManyToOne(() => ProductTemplateEntity, { fieldName: 'template_id' })
  template!: Rel<ProductTemplateEntity>;
}
