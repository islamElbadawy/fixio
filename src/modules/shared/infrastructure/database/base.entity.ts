import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date(), nullable: true })
  updatedAt: Date | null = null;

  @Property({ default: false })
  isDeleted: boolean = false;

  @Property({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;
}
