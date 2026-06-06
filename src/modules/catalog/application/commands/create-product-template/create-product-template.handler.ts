import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductTemplateCommand } from './create-product-template.command';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import { ProductTemplateEntity } from '../../../domain/entities/product-template.entity';
import { generateSlug } from '../../utils/slug.util';

@CommandHandler(CreateProductTemplateCommand)
export class CreateProductTemplateHandler implements ICommandHandler<CreateProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(
    command: CreateProductTemplateCommand,
  ): Promise<ProductTemplateEntity> {
    const { dto } = command;
    const slug = dto.slug ?? generateSlug(dto.name);

    const existing = await this.templateRepo.findBySlug(slug);
    if (existing)
      throw new ConflictException(`Slug "${slug}" is already in use`);

    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category)
      throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const template = this.templateRepo.create({
      name: dto.name,
      slug,
      description: dto.description ?? null,
      brand: dto.brand ?? null,
      category,
    });

    await this.templateRepo.save(template);
    return template;
  }
}
