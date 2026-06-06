import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductVariantCommand } from './update-product-variant.command';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';
import { ProductVariantEntity } from '../../../domain/entities/product-variant.entity';

@CommandHandler(UpdateProductVariantCommand)
export class UpdateProductVariantHandler implements ICommandHandler<UpdateProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
  ) {}

  async execute(
    command: UpdateProductVariantCommand,
  ): Promise<ProductVariantEntity> {
    const { id, dto } = command;

    const variant = await this.variantRepo.findById(id);
    if (!variant)
      throw new NotFoundException(`Product variant ${id} not found`);

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
}
