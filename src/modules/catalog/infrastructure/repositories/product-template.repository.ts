import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProductTemplate } from '../../domain/entities/product-template.entity';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { IProductRepository } from '../../domain/repositories/product-template.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductTemplate)
    private readonly repo: EntityRepository<ProductTemplate>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: EntityRepository<ProductVariant>,
  ) {}

  findById(
    id: string,
    populateVariants = false,
  ): Promise<ProductTemplate | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      {
        populate: populateVariants ? ['category', 'variants'] : ['category'],
      },
    );
  }

  findBySlug(slug: string): Promise<ProductTemplate | null> {
    return this.repo.findOne(
      { slug, isDeleted: false },
      { populate: ['category'] },
    );
  }

  findAll(categoryId?: string): Promise<ProductTemplate[]> {
    const where: Record<string, unknown> = { isDeleted: false, isActive: true };
    if (categoryId) where['category'] = { id: categoryId };
    return this.repo.find(where, {
      populate: ['category'],
      orderBy: { name: 'ASC' },
    });
  }

  async findVariantById(
    variantId: string,
  ): Promise<{ template: ProductTemplate; variant: ProductVariant } | null> {
    const variant = await this.variantRepo.findOne(
      { id: variantId, isDeleted: false },
      { populate: ['template', 'template.category', 'template.variants'] },
    );

    if (!variant) return null;

    return {
      template: variant.template as unknown as ProductTemplate,
      variant,
    };
  }

  async findVariantBySku(sku: string): Promise<ProductTemplate | null> {
    const variant = await this.variantRepo.findOne(
      { sku, isDeleted: false },
      { populate: ['template', 'template.variants'] },
    );

    if (!variant) return null;
    return variant.template as unknown as ProductTemplate;
  }

  async findVariantsBySpecs(
    filters: Record<string, unknown>,
  ): Promise<ProductVariant[]> {
    const em = this.repo.getEntityManager();
    return em
      .createQueryBuilder(ProductVariant, 'v')
      .where({ isDeleted: false, isActive: true })
      .andWhere('v.specs @> ?::jsonb', [JSON.stringify(filters)])
      .getResultList();
  }

  async save(template: ProductTemplate): Promise<void> {
    this.repo.getEntityManager().persist(template);
    await this.repo.getEntityManager().flush();
  }
}
