import { ProductTemplateEntity } from '../entities/product-template.entity';

export const PRODUCT_TEMPLATE_REPOSITORY = Symbol('IProductTemplateRepository');

export interface IProductTemplateRepository {
  findById(id: string): Promise<ProductTemplateEntity | null>;
  findBySlug(slug: string): Promise<ProductTemplateEntity | null>;
  findAll(categoryId?: string): Promise<ProductTemplateEntity[]>;
  save(template: ProductTemplateEntity): Promise<void>;
  create(data: Partial<ProductTemplateEntity>): ProductTemplateEntity;
}
