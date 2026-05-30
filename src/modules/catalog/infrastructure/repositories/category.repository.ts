import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: EntityRepository<CategoryEntity>,
  ) {}

  findById(id: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({ id, isDeleted: false });
  }
  findBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({ slug, isDeleted: false });
  }
  findAll(): Promise<CategoryEntity[]> {
    return this.repo.find(
      {
        isDeleted: false,
      },
      {
        orderBy: { createdAt: 'DESC' },
      },
    );
  }
  findChildren(parentId: string): Promise<CategoryEntity[]> {
    return this.repo.find(
      {
        parent: { id: parentId },
        isDeleted: false,
      },
      {
        orderBy: { createdAt: 'ASC' },
      },
    );
  }
  async save(category: CategoryEntity): Promise<void> {
    this.repo.getEntityManager().persist(category);
    return await this.repo.getEntityManager().flush();
  }
  create(data: Partial<CategoryEntity>): CategoryEntity {
    return this.repo
      .getEntityManager()
      .create(CategoryEntity, data as CategoryEntity);
  }
}
