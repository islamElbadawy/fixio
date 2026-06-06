import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  Index,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './role.enum';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Index({ name: 'idx_users_email' })
  @Property({ type: 'string', length: 255, unique: true })
  email!: string;

  @Property({ type: 'string', length: 255, fieldName: 'password_hash' })
  passwordHash!: string;

  @Property({ type: 'string', length: 100, fieldName: 'full_name' })
  fullName!: string;

  @Enum({ items: () => UserRole, default: UserRole.SALES_EMPLOYEE })
  role: UserRole = UserRole.SALES_EMPLOYEE;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @Property({ type: 'number', default: 0, fieldName: 'failed_login_attempts' })
  failedLoginAttempts: number = 0;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'locked_until' })
  lockedUntil: Date | null = null;

  @Property({
    type: 'string',
    length: 255,
    nullable: true,
    fieldName: 'refresh_token_hash',
  })
  refreshTokenHash: string | null = null;

  @Property({ type: 'boolean', default: false, fieldName: 'is_deleted' })
  isDeleted: boolean = false;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'deleted_at' })
  deletedAt: Date | null = null;

  @Property({
    type: 'timestamptz',
    fieldName: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;
}
