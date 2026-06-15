import {
  Entity,
  Property,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';

@Entity({ tableName: 'warehouses' })
export class WarehouseEntity extends BaseEntity {
  @Property({ type: 'string', length: 100 })
  name!: string;

  @Property({ type: 'string', length: 255, nullable: true })
  location: string | null = null;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;
}