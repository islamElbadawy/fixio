import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RemoveProductVariantCommand } from './remove-product-variant.command';
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/repositories/product-variant.repository.interface';

@CommandHandler(RemoveProductVariantCommand)
export class RemoveProductVariantHandler implements ICommandHandler<RemoveProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: IProductVariantRepository,
  ) {}

  async execute(command: RemoveProductVariantCommand): Promise<void> {
    const variant = await this.variantRepo.findById(command.id);
    if (!variant)
      throw new NotFoundException(`Product variant ${command.id} not found`);

    variant.isDeleted = true;
    variant.deletedAt = new Date();
    await this.variantRepo.save(variant);
  }
}
