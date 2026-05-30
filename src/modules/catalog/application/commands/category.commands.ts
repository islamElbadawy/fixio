import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { generateSlug } from '../utils/slug.util';

@Injectable()
export class CategoryCommands {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const slug = dto.slug ?? generateSlug(dto.name);

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`Slug "${slug}" is already in use`);
    }

    let parent = null;
    if (dto.parentId) {
      parent = await this.categoryRepo.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(
          `Parent category ${dto.parentId} not found`,
        );
      }
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      slug,
      description: dto.description ?? undefined,
      parent,
    });

    await this.categoryRepo.save(category);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    if (dto.name) category.name = dto.name;
    if (dto.description !== undefined)
      category.description = dto.description ?? null;
    if (dto.isActive !== undefined) category.isActive = dto.isActive;

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      }
      category.slug = dto.slug;
    }

    const parentId = dto.parentId;
    if (parentId !== undefined) {
      if (parentId === null) {
        category.parent = null;
      } else {
        if (parentId === category.id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        const parent = await this.categoryRepo.findById(parentId);
        if (!parent) {
          throw new NotFoundException(`Parent category ${parentId} not found`);
        }
        category.parent = parent;
      }
    }

    await this.categoryRepo.save(category);
    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    category.isDeleted = true;
    category.deletedAt = new Date();
    await this.categoryRepo.save(category);
  }
}
