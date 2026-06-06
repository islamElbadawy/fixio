import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCategoryChildrenQuery } from './get-category-children.query';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../../domain/entities/category.entity';

@QueryHandler(GetCategoryChildrenQuery)
export class GetCategoryChildrenHandler implements IQueryHandler<GetCategoryChildrenQuery> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryChildrenQuery): Promise<CategoryEntity[]> {
    const parent = await this.categoryRepo.findById(query.parentId);
    if (!parent)
      throw new NotFoundException(`Category ${query.parentId} not found`);
    return this.categoryRepo.findChildren(query.parentId);
  }
}
