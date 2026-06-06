import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RemoveProductVariantCommand } from './remove-product-variant.command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';

@CommandHandler(RemoveProductVariantCommand)
export class RemoveProductVariantHandler implements ICommandHandler<RemoveProductVariantCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
  ) {}

  async execute(command: RemoveProductVariantCommand): Promise<void> {
    const result = await this.productRepo.findVariantById(command.id);
    if (!result)
      throw new NotFoundException(`Product variant ${command.id} not found`);

    const { template } = result;
    template.removeVariant(command.id);

    await this.productRepo.save(template);

    await this.eventBus.publishAll(template.domainEvents);
    template.clearDomainEvents();
  }
}
