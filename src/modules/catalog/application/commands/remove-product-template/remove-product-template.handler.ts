import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RemoveProductTemplateCommand } from './remove-product-template.command';
import {
  IProductTemplateRepository,
  PRODUCT_TEMPLATE_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';

@CommandHandler(RemoveProductTemplateCommand)
export class RemoveProductTemplateHandler implements ICommandHandler<RemoveProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_TEMPLATE_REPOSITORY)
    private readonly templateRepo: IProductTemplateRepository,
  ) {}

  async execute(command: RemoveProductTemplateCommand): Promise<void> {
    const template = await this.templateRepo.findById(command.id);
    if (!template)
      throw new NotFoundException(`Product template ${command.id} not found`);

    template.isDeleted = true;
    template.deletedAt = new Date();
    await this.templateRepo.save(template);
  }
}
