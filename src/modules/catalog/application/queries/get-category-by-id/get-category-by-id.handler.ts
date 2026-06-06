import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCategoryByIdQuery } from './get-category-by-id.query';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../../domain/entities/category.entity';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findById(query.id);
    if (!category)
      throw new NotFoundException(`Category ${query.id} not found`);
    return category;
  }
}
