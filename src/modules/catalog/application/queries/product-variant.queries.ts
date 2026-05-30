import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../domain/repositories/product-variant.repository.interface';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../domain/repositories/product-template.repository.interface';
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity';

@Injectable()
export class ProductVariantQueries {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async getVariantById(id: string): Promise<ProductVariantEntity> {
    const variant = await this.variantRepo.findById(id);
    if (!variant) {
      throw new NotFoundException(`Product variant ${id} not found`);
    }
    return variant;
  }

  async getVariantBySku(sku: string): Promise<ProductVariantEntity> {
    const variant = await this.variantRepo.findBySku(sku);
    if (!variant) {
      throw new NotFoundException(`SKU "${sku}" not found`);
    }
    return variant;
  }

  async getVariantsByTemplate(
    templateId: string,
  ): Promise<ProductVariantEntity[]> {
    const template = await this.templateRepo.findById(templateId);
    if (!template) {
      throw new NotFoundException(`Product template ${templateId} not found`);
    }
    return this.variantRepo.findByTemplate(templateId);
  }

  async getVariantsBySpecs(
    filters: Record<string, unknown>,
  ): Promise<ProductVariantEntity[]> {
    return this.variantRepo.findBySpecs(filters);
  }
}
