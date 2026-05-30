import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Collection, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { CategoryEntity } from './category.entity';
import { ProductVariantEntity } from './product-variant.entity';
import { Exclude } from 'class-transformer';

@Entity({ tableName: 'product_templates' })
export class ProductTemplateEntity extends BaseEntity {
  @Property({ type: 'string', length: 150 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'string', length: 100, nullable: true })
  brand: string | null = null;

  @Index({ name: 'idx_templates_slug' })
  @Property({ type: 'string', length: 200, unique: true })
  slug!: string;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @ManyToOne(() => CategoryEntity, { fieldName: 'category_id' })
  category!: Rel<CategoryEntity>;

  @Exclude()
  @OneToMany(() => ProductVariantEntity, (v) => v.template)
  variants = new Collection<ProductVariantEntity>(this);
}
