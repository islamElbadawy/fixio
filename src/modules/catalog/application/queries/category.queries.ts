import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';

@Injectable()
export class CategoryQueries {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepo.findAll();
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async getCategoryChildren(parentId: string): Promise<CategoryEntity[]> {
    const parent = await this.categoryRepo.findById(parentId);
    if (!parent) {
      throw new NotFoundException(`Category ${parentId} not found`);
    }
    return this.categoryRepo.findChildren(parentId);
  }
}
