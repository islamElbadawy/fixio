import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVariantsBySpecsQuery } from './get-variants-by-specs.query';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantsBySpecsQuery)
export class GetVariantsBySpecsHandler implements IQueryHandler<GetVariantsBySpecsQuery> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
  ) {}

  async execute(
    query: GetVariantsBySpecsQuery,
  ): Promise<ProductVariantEntity[]> {
    return this.variantRepo.findBySpecs(query.filters);
  }
}
