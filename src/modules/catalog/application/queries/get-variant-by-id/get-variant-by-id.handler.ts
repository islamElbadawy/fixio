import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVariantByIdQuery } from './get-variant-by-id.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductVariant } from '../../../domain/entities/product-variant.entity';

@QueryHandler(GetVariantByIdQuery)
export class GetVariantByIdHandler implements IQueryHandler<GetVariantByIdQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: GetVariantByIdQuery): Promise<ProductVariant> {
    const result = await this.productRepo.findVariantById(query.id);
    if (!result)
      throw new NotFoundException(`Product variant ${query.id} not found`);
    return result.variant;
  }
}
