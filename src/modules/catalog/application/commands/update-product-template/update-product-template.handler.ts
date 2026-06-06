import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateProductTemplateCommand } from './update-product-template.command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product-template.repository.interface';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../../domain/repositories/category.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { ProductTemplate } from '../../../domain/entities/product-template.entity';

@CommandHandler(UpdateProductTemplateCommand)
export class UpdateProductTemplateHandler implements ICommandHandler<UpdateProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
  ) {}

  async execute(
    command: UpdateProductTemplateCommand,
  ): Promise<ProductTemplate> {
    const { id, dto } = command;

    const template = await this.productRepo.findById(id);
    if (!template)
      throw new NotFoundException(`Product template ${id} not found`);

    if (dto.slug && dto.slug !== template.slug) {
      const existing = await this.productRepo.findBySlug(dto.slug);
      if (existing)
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
    }

    let category = undefined;
    if (dto.categoryId) {
      category = await this.categoryRepo.findById(dto.categoryId);
      if (!category)
        throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

    template.updateDetails({
      name: dto.name,
      description: dto.description,
      brand: dto.brand,
      slug: dto.slug,
      isActive: dto.isActive,
      category,
    });

    await this.productRepo.save(template);
    return template;
  }
}
