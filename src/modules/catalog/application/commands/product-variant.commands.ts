import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../domain/repositories/product-variant.repository.interface';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../domain/repositories/product-template.repository.interface';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity';

@Injectable()
export class ProductVariantCommands {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariantEntity> {
    const existingSku = await this.variantRepo.findBySku(dto.sku);
    if (existingSku) {
      throw new ConflictException(`SKU "${dto.sku}" is already in use`);
    }

    const template = await this.templateRepo.findById(dto.templateId);
    if (!template) {
      throw new NotFoundException(
        `Product template ${dto.templateId} not found`,
      );
    }

    const variant = this.variantRepo.create({
      sku: dto.sku,
      name: dto.name ?? null,
      purchasePrice: dto.purchasePrice,
      sellingPrice: dto.sellingPrice,
      specs: dto.specs ?? {},
      unit: dto.unit ?? null,
      template,
    });

    await this.variantRepo.save(variant);
    return variant;
  }

  async update(
    id: string,
    dto: UpdateProductVariantDto,
  ): Promise<ProductVariantEntity> {
    const variant = await this.variantRepo.findById(id);
    if (!variant) {
      throw new NotFoundException(`Product variant ${id} not found`);
    }

    if (dto.name !== undefined) variant.name = dto.name ?? null;
    if (dto.purchasePrice !== undefined)
      variant.purchasePrice = dto.purchasePrice;
    if (dto.sellingPrice !== undefined) variant.sellingPrice = dto.sellingPrice;
    if (dto.unit !== undefined) variant.unit = dto.unit ?? null;
    if (dto.isActive !== undefined) variant.isActive = dto.isActive;
    if (dto.specs !== undefined) variant.specs = dto.specs;

    await this.variantRepo.save(variant);
    return variant;
  }

  async remove(id: string): Promise<void> {
    const variant = await this.variantRepo.findById(id);
    if (!variant) {
      throw new NotFoundException(`Product variant ${id} not found`);
    }

    variant.isDeleted = true;
    variant.deletedAt = new Date();
    await this.variantRepo.save(variant);
  }
}
