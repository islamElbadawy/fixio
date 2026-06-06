import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllTemplatesQuery } from './get-all-templates.query';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductTemplateEntity } from '../../../domain/entities/product-template.entity';

@QueryHandler(GetAllTemplatesQuery)
export class GetAllTemplatesHandler implements IQueryHandler<GetAllTemplatesQuery> {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async execute(query: GetAllTemplatesQuery): Promise<ProductTemplateEntity[]> {
    return this.templateRepo.findAll(query.categoryId);
  }
}
