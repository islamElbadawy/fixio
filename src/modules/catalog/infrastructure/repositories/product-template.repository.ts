import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ProductTemplateEntity } from '../../domain/entities/product-template.entity';
import { IProductTemplateRepository } from '../../domain/repositories/product-template.repository.interface';

@Injectable()
export class ProductTemplateRepository implements IProductTemplateRepository {
  constructor(
    @InjectRepository(ProductTemplateEntity)
    private readonly repo: EntityRepository<ProductTemplateEntity>,
  ) {}

  findById(id: string): Promise<ProductTemplateEntity | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      { populate: ['category'] },
    );
  }

  findBySlug(slug: string): Promise<ProductTemplateEntity | null> {
    return this.repo.findOne(
      { slug, isDeleted: false },
      { populate: ['category'] },
    );
  }

  findAll(categoryId?: string): Promise<ProductTemplateEntity[]> {
    const where: Record<string, unknown> = { isDeleted: false, isActive: true };
    if (categoryId) where['category'] = { id: categoryId };

    return this.repo.find(where, {
      populate: ['category'],
      orderBy: { name: 'ASC' },
    });
  }

  async save(template: ProductTemplateEntity): Promise<void> {
    this.repo.getEntityManager().persist(template);
    return await this.repo.getEntityManager().flush();
  }

  create(data: Partial<ProductTemplateEntity>): ProductTemplateEntity {
    return this.repo
      .getEntityManager()
      .create(ProductTemplateEntity, data as ProductTemplateEntity);
  }
}
