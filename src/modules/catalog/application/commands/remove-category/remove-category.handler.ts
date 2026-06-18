import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RemoveCategoryCommand } from './remove-category.command';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';

@CommandHandler(RemoveCategoryCommand)
export class RemoveCategoryHandler implements ICommandHandler<RemoveCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(command: RemoveCategoryCommand): Promise<void> {
    const category = await this.categoryRepo.findById(command.id);
    if (!category)
      throw new NotFoundException(`Category ${command.id} not found`);

    category.isDeleted = true;
    category.deletedAt = new Date();
    await this.categoryRepo.save(category);
  }
}
