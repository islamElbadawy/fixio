import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductVariantCommand } from './update-product-variant.command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { ProductVariant } from '../../../domain/entities/product-variant.entity';

@CommandHandler(UpdateProductVariantCommand)
export class UpdateProductVariantHandler implements ICommandHandler<UpdateProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
  ) {}

  async execute(command: UpdateProductVariantCommand): Promise<ProductVariant> {
    const { id, dto } = command;

    const result = await this.productRepo.findVariantById(id);
    if (!result) throw new NotFoundException(`Product variant ${id} not found`);

    const { template, variant } = result;

    const updatedVariant = template.updateVariant(id, {
      name: dto.name,
      purchasePrice: dto.purchasePrice,
      sellingPrice: dto.sellingPrice,
      specs: dto.specs,
      unit: dto.unit,
      isActive: dto.isActive,
    });

    await this.productRepo.save(template);

    await this.eventBus.publishAll(template.domainEvents);
    template.clearDomainEvents();

    return updatedVariant;
  }
}
