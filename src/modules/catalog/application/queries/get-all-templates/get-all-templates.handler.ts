import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllTemplatesQuery } from './get-all-templates.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductTemplate } from '../../../domain/entities/product-template.entity';

@QueryHandler(GetAllTemplatesQuery)
export class GetAllTemplatesHandler implements IQueryHandler<GetAllTemplatesQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetAllTemplatesQuery): Promise<ProductTemplate[]> {
    return this.productRepo.findAll(query.categoryId);
  }
}
