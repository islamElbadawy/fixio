import { ProductTemplate } from '../entities/product-template.entity';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  findById(
    id: string,
    populateVariants?: boolean,
  ): Promise<ProductTemplate | null>;
  findBySlug(slug: string): Promise<ProductTemplate | null>;
  findAll(categoryId?: string): Promise<ProductTemplate[]>;
  findVariantById(
    variantId: string,
  ): Promise<{ template: ProductTemplate; variant: any } | null>;
  findVariantBySku(sku: string): Promise<ProductTemplate | null>;
  findVariantsBySpecs(filters: Record<string, unknown>): Promise<any[]>;
  save(template: ProductTemplate): Promise<void>;
}
