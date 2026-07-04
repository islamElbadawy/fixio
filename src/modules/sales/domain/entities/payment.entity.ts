import {
  Entity,
  Property,
  ManyToOne,
  Enum,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { PaymentMethod } from './payment-method.enum';

@Entity({ tableName: 'payments' })
export class Payment extends BaseEntity {
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Enum({ items: () => PaymentMethod })
  method!: PaymentMethod;

  @Property({ type: 'text', nullable: true })
  notes: string | null = null;

  @Property({ type: 'uuid', nullable: true, fieldName: 'actor_id' })
  actorId: string | null = null;

  @Exclude()
  @ManyToOne(() => Invoice, { fieldName: 'invoice_id' })
  invoice!: Rel<Invoice>;
}

import { Invoice } from './invoice.aggregate';
