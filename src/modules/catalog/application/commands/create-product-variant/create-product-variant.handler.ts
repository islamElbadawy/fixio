import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductVariantCommand } from './create-product-variant.command';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@CommandHandler(CreateProductVariantCommand)
export class CreateProductVariantHandler implements ICommandHandler<CreateProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async execute(
    command: CreateProductVariantCommand,
  ): Promise<ProductVariantEntity> {
    const { dto } = command;

    const existingSku = await this.variantRepo.findBySku(dto.sku);
    if (existingSku)
      throw new ConflictException(`SKU "${dto.sku}" is already in use`);

    const template = await this.templateRepo.findById(dto.templateId);
    if (!template)
      throw new NotFoundException(
        `Product template ${dto.templateId} not found`,
      );

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
}
