import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantsByTemplateQuery } from './get-variants-by-template.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductVariant } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantsByTemplateQuery)
export class GetVariantsByTemplateHandler implements IQueryHandler<GetVariantsByTemplateQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetVariantsByTemplateQuery): Promise<ProductVariant[]> {
    const template = await this.productRepo.findById(query.templateId, true);
    if (!template)
      throw new NotFoundException(
        `Product template ${query.templateId} not found`,
      );
    return template.variants.getItems();
  }
}
