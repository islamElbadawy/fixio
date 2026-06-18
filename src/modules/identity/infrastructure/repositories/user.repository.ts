import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { InjectRepository } from '@mikro-orm/nestjs';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: EntityRepository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ id, isDeleted: false });
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ email, isDeleted: false });
  }
  async save(user: UserEntity): Promise<void> {
    this.repo.getEntityManager().persist(user);
    await this.repo.getEntityManager().flush();
  }
  create(data: Partial<UserEntity>): UserEntity {
    return this.repo.getEntityManager().create(UserEntity, data as UserEntity);
  }
}
