import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../domain/repositories/product-template.repository.interface';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository.interface';
import {
  CreateProductTemplateDto,
  UpdateProductTemplateDto,
} from '../dtos/product-template.dto';
import { ProductTemplateEntity } from '../../domain/entities/product-template.entity';
import { generateSlug } from '../utils/slug.util';

@Injectable()
export class ProductTemplateCommands {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async create(dto: CreateProductTemplateDto): Promise<ProductTemplateEntity> {
    const slug = dto.slug ?? generateSlug(dto.name);

    const existing = await this.templateRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`Slug "${slug}" is already in use`);
    }

    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

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

  async update(
    id: string,
    dto: UpdateProductTemplateDto,
  ): Promise<ProductTemplateEntity> {
    const template = await this.templateRepo.findById(id);
    if (!template) {
      throw new NotFoundException(`Product template ${id} not found`);
    }

    if (dto.name) template.name = dto.name;
    if (dto.description !== undefined)
      template.description = dto.description ?? null;
    if (dto.brand !== undefined) template.brand = dto.brand ?? null;
    if (dto.isActive !== undefined) template.isActive = dto.isActive;

    if (dto.slug && dto.slug !== template.slug) {
      const existing = await this.templateRepo.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      }
      template.slug = dto.slug;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException(`Category ${dto.categoryId} not found`);
      }
      template.category = category;
    }

    await this.templateRepo.save(template);
    return template;
  }

  async remove(id: string): Promise<void> {
    const template = await this.templateRepo.findById(id);
    if (!template) {
      throw new NotFoundException(`Product template ${id} not found`);
    }

    template.isDeleted = true;
    template.deletedAt = new Date();
    await this.templateRepo.save(template);
  }
}
