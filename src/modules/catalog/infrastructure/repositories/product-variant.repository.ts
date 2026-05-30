import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity';
import { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';

@Injectable()
export class ProductVariantRepository implements IProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly repo: EntityRepository<ProductVariantEntity>,
  ) {}

  findById(id: string): Promise<ProductVariantEntity | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      { populate: ['template', 'template.category'] },
    );
  }

  findBySku(sku: string): Promise<ProductVariantEntity | null> {
    return this.repo.findOne(
      { sku, isDeleted: false },
      { populate: ['template'] },
    );
  }

  findByTemplate(templateId: string): Promise<ProductVariantEntity[]> {
    return this.repo.find(
      { template: { id: templateId }, isDeleted: false },
      { orderBy: { sku: 'ASC' } },
    );
  }

  async findBySpecs(
    filters: Record<string, unknown>,
  ): Promise<ProductVariantEntity[]> {
    const em = this.repo.getEntityManager();

    const results = await em
      .createQueryBuilder(ProductVariantEntity, 'v')
      .where({ isDeleted: false, isActive: true })
      .andWhere(`v.specs @> '${JSON.stringify(filters)}'::jsonb`)
      .getResultList();

    return results;
  }

  async save(variant: ProductVariantEntity): Promise<void> {
    this.repo.getEntityManager().persist(variant);
    return await this.repo.getEntityManager().flush();
  }

  create(data: Partial<ProductVariantEntity>): ProductVariantEntity {
    return this.repo
      .getEntityManager()
      .create(ProductVariantEntity, data as ProductVariantEntity);
  }
}
