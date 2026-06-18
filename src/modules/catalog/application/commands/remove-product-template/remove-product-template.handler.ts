import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RemoveProductTemplateCommand } from './remove-product-template.command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';

@CommandHandler(RemoveProductTemplateCommand)
export class RemoveProductTemplateHandler implements ICommandHandler<RemoveProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(command: RemoveProductTemplateCommand): Promise<void> {
    const template = await this.productRepo.findById(command.id);
    if (!template)
      throw new NotFoundException(`Product template ${command.id} not found`);
    template.remove();
    await this.productRepo.save(template);
  }
}
