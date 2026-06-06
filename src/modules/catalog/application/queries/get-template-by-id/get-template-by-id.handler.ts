import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetTemplateByIdQuery } from './get-template-by-id.query';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductTemplateEntity } from '../../../domain/entities/product-template.entity';

@QueryHandler(GetTemplateByIdQuery)
export class GetTemplateByIdHandler implements IQueryHandler<GetTemplateByIdQuery> {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async execute(query: GetTemplateByIdQuery): Promise<ProductTemplateEntity> {
    const template = await this.templateRepo.findById(query.id);
    if (!template)
      throw new NotFoundException(`Product template ${query.id} not found`);
    return template;
  }
}
