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

import {
  CategoryController,
  ProductTemplateController,
  ProductVariantController,
} from './presentation/catalog.controller';
import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { CreateProductTemplateHandler } from './application/commands/create-product-template/create-product-template.handler';
import { CreateProductVariantHandler } from './application/commands/create-product-variant/create-product-variant.handler';
import { RemoveCategoryHandler } from './application/commands/remove-category/remove-category.handler';
import { RemoveProductTemplateHandler } from './application/commands/remove-product-template/remove-product-template.handler';
import { RemoveProductVariantHandler } from './application/commands/remove-product-variant/remove-product-variant.handler';
import { UpdateCategoryHandler } from './application/commands/update-category/update-category.handler';
import { UpdateProductTemplateHandler } from './application/commands/update-product-template/update-product-template.handler';
import { UpdateProductVariantHandler } from './application/commands/update-product-variant/update-product-variant.handler';
import { GetAllCategoriesHandler } from './application/queries/get-all-categories/get-all-categories.handler';
import { GetAllTemplatesHandler } from './application/queries/get-all-templates/get-all-templates.handler';
import { GetCategoryByIdHandler } from './application/queries/get-category-by-id/get-category-by-id.handler';
import { GetCategoryChildrenHandler } from './application/queries/get-category-children/get-category-children.handler';
import { GetTemplateByIdHandler } from './application/queries/get-template-by-id/get-template-by-id.handler';
import { GetVariantByIdHandler } from './application/queries/get-variant-by-id/get-variant-by-id.handler';
import { GetVariantBySkuHandler } from './application/queries/get-variant-by-sku/get-variant-by-sku.handler';
import { GetVariantsBySpecsHandler } from './application/queries/get-variants-by-specs/get-variants-by-specs.handler';
import { GetVariantsByTemplateHandler } from './application/queries/get-variants-by-template/get-variants-by-template.handler';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  RemoveCategoryHandler,
  CreateProductTemplateHandler,
  UpdateProductTemplateHandler,
  RemoveProductTemplateHandler,
  CreateProductVariantHandler,
  UpdateProductVariantHandler,
  RemoveProductVariantHandler,
];

const QueryHandlers = [
  GetAllCategoriesHandler,
  GetCategoryByIdHandler,
  GetCategoryChildrenHandler,
  GetAllTemplatesHandler,
  GetTemplateByIdHandler,
  GetVariantByIdHandler,
  GetVariantBySkuHandler,
  GetVariantsByTemplateHandler,
  GetVariantsBySpecsHandler,
];

@Module({
  imports: [
    CqrsModule,
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
    ...CommandHandlers,
    ...QueryHandlers,

    // Repository bindings
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    {
      provide: PRODUCT_TEMPLATE_REPOSITORY,
      useClass: ProductTemplateRepository,
    },
    { provide: PRODUCT_VARIANT_REPOSITORY, useClass: ProductVariantRepository },
  ],
  exports: [
    CATEGORY_REPOSITORY,
    PRODUCT_TEMPLATE_REPOSITORY,
    PRODUCT_VARIANT_REPOSITORY,
    CqrsModule,
  ],
})
export class CatalogModule {}
