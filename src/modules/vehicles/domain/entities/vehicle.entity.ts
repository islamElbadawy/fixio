import {
  Entity,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { CustomerEntity } from 'src/modules/customers/domain/entities/customer.entity';

@Entity({ tableName: 'vehicles' })
export class VehicleEntity extends BaseEntity {
  @Property({ type: 'string', length: 100 })
  make!: string;

  @Property({ type: 'string', length: 100 })
  model!: string;

  @Property({ type: 'integer' })
  year!: number;

  @Index({ name: 'idx_vehicles_plate' })
  @Property({
    type: 'string',
    length: 20,
    unique: true,
    fieldName: 'license_plate',
  })
  licensePlate!: string;

  @Property({ type: 'string', length: 17, nullable: true, unique: true })
  vin: string | null = null;

  @Property({ type: 'string', length: 50, nullable: true })
  color: string | null = null;

  @Property({ type: 'integer', default: 0 })
  mileage: number = 0;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @ManyToOne(() => CustomerEntity, { fieldName: 'customer_id' })
  customer!: Rel<CustomerEntity>;
}
