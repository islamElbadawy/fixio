import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVariantsBySpecsQuery } from './get-variants-by-specs.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductVariant } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantsBySpecsQuery)
export class GetVariantsBySpecsHandler implements IQueryHandler<GetVariantsBySpecsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetVariantsBySpecsQuery): Promise<ProductVariant[]> {
    return this.productRepo.findVariantsBySpecs(query.filters);
  }
}
