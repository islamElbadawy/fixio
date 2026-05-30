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

@Entity({ tableName: 'product_templates' })
export class ProductTemplateEntity extends BaseEntity {
  @Property({ length: 150 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ length: 100, nullable: true })
  brand: string | null = null;

  @Index({ name: 'idx_templates_slug' })
  @Property({ length: 200, unique: true })
  slug!: string;

  @Property({ default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @ManyToOne(() => CategoryEntity, { fieldName: 'category_id' })
  category!: Rel<CategoryEntity>;

  @OneToMany(() => ProductVariantEntity, (v) => v.template)
  variants = new Collection<ProductVariantEntity>(this);
}
