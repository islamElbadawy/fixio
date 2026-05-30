import { ProductVariantEntity } from '../entities/product-variant.entity';

export const PRODUCT_VARIANT_REPOSITORY = Symbol('IProductVariantRepository');

export interface IProductVariantRepository {
  findById(id: string): Promise<ProductVariantEntity | null>;
  findBySku(sku: string): Promise<ProductVariantEntity | null>;
  findByTemplate(templateId: string): Promise<ProductVariantEntity[]>;
  findBySpecs(
    filters: Record<string, unknown>,
  ): Promise<ProductVariantEntity[]>;
  save(variant: ProductVariantEntity): Promise<void>;
  create(data: Partial<ProductVariantEntity>): ProductVariantEntity;
}
