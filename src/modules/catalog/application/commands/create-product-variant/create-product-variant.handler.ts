import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductVariantCommand } from './create-product-variant.command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { ProductVariant } from '../../../domain/entities/product-variant.entity';

@CommandHandler(CreateProductVariantCommand)
export class CreateProductVariantHandler implements ICommandHandler<CreateProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
  ) {}

  async execute(command: CreateProductVariantCommand): Promise<ProductVariant> {
    const { dto } = command;

    const existingTemplate = await this.productRepo.findVariantBySku(dto.sku);
    if (existingTemplate)
      throw new ConflictException(`SKU "${dto.sku}" is already in use`);

    const template = await this.productRepo.findById(dto.templateId, true);
    if (!template)
      throw new NotFoundException(
        `Product template ${dto.templateId} not found`,
      );

    const variant = template.addVariant(
      dto.sku,
      dto.purchasePrice,
      dto.sellingPrice,
      dto.specs ?? {},
      dto.name,
      dto.unit,
    );

    await this.productRepo.save(template);

    await this.eventBus.publishAll(template.domainEvents);
    template.clearDomainEvents();

    return variant;
  }
}
