import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantsByTemplateQuery } from './get-variants-by-template.query';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantsByTemplateQuery)
export class GetVariantsByTemplateHandler implements IQueryHandler<GetVariantsByTemplateQuery> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async execute(
    query: GetVariantsByTemplateQuery,
  ): Promise<ProductVariantEntity[]> {
    const template = await this.templateRepo.findById(query.templateId);
    if (!template)
      throw new NotFoundException(
        `Product template ${query.templateId} not found`,
      );
    return this.variantRepo.findByTemplate(query.templateId);
  }
}
