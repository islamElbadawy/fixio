import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { CategoryEntity } from './domain/entities/category.entity';
import { ProductTemplateEntity } from './domain/entities/product-template.entity';
import { ProductVariantEntity } from './domain/entities/product-variant.entity';

import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { ProductTemplateRepository } from './infrastructure/repositories/product-template.repository';
import { ProductVariantRepository } from './infrastructure/repositories/product-variant.repository';

import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { PRODUCT_TEMPLATE_REPOSITORY } from './domain/repositories/product-template.repository.interface';
import { PRODUCT_VARIANT_REPOSITORY } from './domain/repositories/product-variant.repository.interface';

import { CategoryCommands } from './application/commands/category.commands';
import { ProductTemplateCommands } from './application/commands/product-template.commands';
import { ProductVariantCommands } from './application/commands/product-variant.commands';
import {
  CategoryController,
  ProductTemplateController,
  ProductVariantController,
} from './presentation/catalog.controller';
import {
  CategoryQueries,
  ProductTemplateQueries,
  ProductVariantQueries,
} from './application/queries/catalog.queries';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CategoryEntity,
      ProductTemplateEntity,
      ProductVariantEntity,
    ]),
  ],
  controllers: [
    CategoryController,
    ProductTemplateController,
    ProductVariantController,
  ],
  providers: [
    // Commands
    CategoryCommands,
    ProductTemplateCommands,
    ProductVariantCommands,

    // Queries
    CategoryQueries,
    ProductTemplateQueries,
    ProductVariantQueries,

    // Repository bindings
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: PRODUCT_TEMPLATE_REPOSITORY,
      useClass: ProductTemplateRepository,
    },
    {
      provide: PRODUCT_VARIANT_REPOSITORY,
      useClass: ProductVariantRepository,
    },
  ],
  exports: [
    CATEGORY_REPOSITORY,
    PRODUCT_TEMPLATE_REPOSITORY,
    PRODUCT_VARIANT_REPOSITORY,
    CategoryQueries,
    ProductTemplateQueries,
    ProductVariantQueries,
  ],
})
export class CatalogModule {}
