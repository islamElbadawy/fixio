import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../domain/repositories/product-template.repository.interface';
import { ProductTemplateEntity } from '../../domain/entities/product-template.entity';

@Injectable()
export class ProductTemplateQueries {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async getAllTemplates(categoryId?: string): Promise<ProductTemplateEntity[]> {
    return this.templateRepo.findAll(categoryId);
  }

  async getTemplateById(id: string): Promise<ProductTemplateEntity> {
    const template = await this.templateRepo.findById(id);
    if (!template) {
      throw new NotFoundException(`Product template ${id} not found`);
    }
    return template;
  }
}
