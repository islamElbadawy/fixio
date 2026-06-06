import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantByIdQuery } from './get-variant-by-id.query';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantByIdQuery)
export class GetVariantByIdHandler implements IQueryHandler<GetVariantByIdQuery> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
  ) {}

  async execute(query: GetVariantByIdQuery): Promise<ProductVariantEntity> {
    const variant = await this.variantRepo.findById(query.id);
    if (!variant)
      throw new NotFoundException(`Product variant ${query.id} not found`);
    return variant;
  }
}
