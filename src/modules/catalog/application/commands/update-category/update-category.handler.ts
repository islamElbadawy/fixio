import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateCategoryCommand } from './update-category.command';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../../domain/entities/category.entity';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryEntity> {
    const { id, dto } = command;

    const category = await this.categoryRepo.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);

    if (dto.name) category.name = dto.name;
    if (dto.description !== undefined)
      category.description = dto.description ?? null;
    if (dto.isActive !== undefined) category.isActive = dto.isActive;

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findBySlug(dto.slug);
      if (existing)
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      category.slug = dto.slug;
    }

    if (dto.parentId !== undefined) {
      if (!dto.parentId) {
        category.parent = null;
      } else {
        const parent = await this.categoryRepo.findById(dto.parentId);
        if (!parent)
          throw new NotFoundException(
            `Parent category ${dto.parentId} not found`,
          );
        category.parent = parent;
      }
    }

    await this.categoryRepo.save(category);
    return category;
  }
}
