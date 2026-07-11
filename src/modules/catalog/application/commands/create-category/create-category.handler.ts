import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from 'src/modules/catalog/domain/repositories/category.repository.interface';
import { CategoryEntity } from 'src/modules/catalog/domain/entities/category.entity';
import { generateSlug } from '../../utils/slug.util';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}
  async execute(command: CreateCategoryCommand): Promise<CategoryEntity> {
    const { dto } = command;
    const slug = dto.slug ?? generateSlug(dto.name);

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing)
      throw new ConflictException(`Slug "${slug}" is already in use`);

    let parent = null;
    if (dto.parentId) {
      parent = await this.categoryRepo.findById(dto.parentId);
      if (!parent)
        throw new NotFoundException(
          `Parent category ${dto.parentId} not found`,
        );
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      slug,
      description: dto.description ?? null,
      parent,
    });

    await this.categoryRepo.save(category);
    return category;
  }
}
