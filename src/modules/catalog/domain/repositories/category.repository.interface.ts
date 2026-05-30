import { CategoryEntity } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('ICategoryRepository');

export interface ICategoryRepository {
  findById(id: string): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  findChildren(parentId: string): Promise<CategoryEntity[]>;
  save(category: CategoryEntity): Promise<void>;
  create(data: Partial<CategoryEntity>): CategoryEntity;
}
