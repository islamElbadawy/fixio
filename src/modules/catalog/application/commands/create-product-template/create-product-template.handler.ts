import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductTemplateCommand } from './create-product-template.command';
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

@CommandHandler(CreateProductTemplateCommand)
export class CreateProductTemplateHandler implements ICommandHandler<CreateProductTemplateCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
  ) {}

  async execute(
    command: CreateProductTemplateCommand,
  ): Promise<ProductTemplate> {
    const { dto } = command;
    const slug = dto.slug ?? generateSlug(dto.name);

    const existing = await this.productRepo.findBySlug(slug);
    if (existing)
      throw new ConflictException(`Slug "${slug}" is already in use`);

    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category)
      throw new NotFoundException(`Category ${dto.categoryId} not found`);

    const template = ProductTemplate.create(
      dto.name,
      slug,
      category,
      dto.description,
      dto.brand,
    );

    await this.productRepo.save(template);

    await this.eventBus.publishAll(template.domainEvents);
    template.clearDomainEvents();

    return template;
  }
}
