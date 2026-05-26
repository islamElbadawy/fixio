import { EntityManager } from '@mikro-orm/core';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

export class UserRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { id, isDeleted: false });
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { email, isDeleted: false });
  }
  async save(user: UserEntity): Promise<void> {
    this.em.persist(user);
    await this.em.flush();
  }
  create(data: Partial<UserEntity>): UserEntity {
    return this.em.create(UserEntity, data as UserEntity);
  }
}
