import { Entity, Property, Index } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';

@Entity({ tableName: 'customers' })
export class CustomerEntity extends BaseEntity {
  @Property({ type: 'string', length: 150 })
  name!: string;

  @Index({ name: 'idx_customers_phone' })
  @Property({ type: 'string', length: 20, unique: true })
  phone!: string;

  @Property({ type: 'string', length: 255, nullable: true, unique: true })
  email: string | null = null;

  @Property({ type: 'text', nullable: true })
  address: string | null = null;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'credit_limit',
  })
  creditLimit: number = 0;

  @Property({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    fieldName: 'credit_used',
  })
  creditUsed: number = 0;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;
}
