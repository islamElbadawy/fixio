import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Collection, Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';

@Entity({ tableName: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Property({ type: 'string', length: 100 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Index({ name: 'idx_categories_slug' })
  @Property({ type: 'string', length: 150, unique: true })
  slug!: string;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'parent_id' })
  parent: Rel<CategoryEntity> | null = null;

  @Exclude()
  @OneToMany(() => CategoryEntity, (cat) => cat.parent)
  children = new Collection<CategoryEntity>(this);
}
