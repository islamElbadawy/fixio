import { Collection, Rel } from '@mikro-orm/core';
import {
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/base.entity';

@Entity({ tableName: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Property({ length: 100 })
  name!: string;

  @Property({ length: 255, nullable: true })
  description?: string;

  @Index({ name: 'idx_category_slug' })
  @Property({ length: 150, unique: true })
  slug!: string;

  @Property({ default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'parent_id' })
  parent: Rel<CategoryEntity> | null = null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children = new Collection<CategoryEntity>(this);
}
