import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantBySkuQuery } from './get-variant-by-sku.query';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantBySkuQuery)
export class GetVariantBySkuHandler implements IQueryHandler<GetVariantBySkuQuery> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
  ) {}

  async execute(query: GetVariantBySkuQuery): Promise<ProductVariantEntity> {
    const variant = await this.variantRepo.findBySku(query.sku);
    if (!variant) throw new NotFoundException(`SKU "${query.sku}" not found`);
    return variant;
  }
}
