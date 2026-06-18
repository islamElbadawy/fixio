import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantBySkuQuery } from './get-variant-by-sku.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductTemplate } from '../../../domain/entities/product-template.entity';

@QueryHandler(GetVariantBySkuQuery)
export class GetVariantBySkuHandler implements IQueryHandler<GetVariantBySkuQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetVariantBySkuQuery): Promise<ProductTemplate> {
    const template = await this.productRepo.findVariantBySku(query.sku);
    if (!template) throw new NotFoundException(`SKU "${query.sku}" not found`);
    return template;
  }
}
