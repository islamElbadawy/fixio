import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetTemplateByIdQuery } from './get-template-by-id.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductTemplate } from '../../../domain/entities/product-template.entity';

@QueryHandler(GetTemplateByIdQuery)
export class GetTemplateByIdHandler implements IQueryHandler<GetTemplateByIdQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetTemplateByIdQuery): Promise<ProductTemplate> {
    const template = await this.productRepo.findById(query.id);
    if (!template)
      throw new NotFoundException(`Product template ${query.id} not found`);
    return template;
  }
}
