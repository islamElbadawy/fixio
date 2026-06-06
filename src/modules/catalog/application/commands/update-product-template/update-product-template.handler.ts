import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateProductTemplateCommand } from './update-product-template.command';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import { ProductTemplateEntity } from '../../../domain/entities/product-template.entity';

@CommandHandler(UpdateProductTemplateCommand)
export class UpdateProductTemplateHandler implements ICommandHandler<UpdateProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(
    command: UpdateProductTemplateCommand,
  ): Promise<ProductTemplateEntity> {
    const { id, dto } = command;

    const template = await this.templateRepo.findById(id);
    if (!template)
      throw new NotFoundException(`Product template ${id} not found`);

    if (dto.name) template.name = dto.name;
    if (dto.description !== undefined)
      template.description = dto.description ?? null;
    if (dto.brand !== undefined) template.brand = dto.brand ?? null;
    if (dto.isActive !== undefined) template.isActive = dto.isActive;

    if (dto.slug && dto.slug !== template.slug) {
      const existing = await this.templateRepo.findBySlug(dto.slug);
      if (existing)
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      template.slug = dto.slug;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findById(dto.categoryId);
      if (!category)
        throw new NotFoundException(`Category ${dto.categoryId} not found`);
      template.category = category;
    }

    await this.templateRepo.save(template);
    return template;
  }
}
