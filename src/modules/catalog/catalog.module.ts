import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

import { CategoryEntity } from './domain/entities/category.entity';
import { ProductTemplate } from './domain/entities/product-template.entity';
import { ProductVariant } from './domain/entities/product-variant.entity';

import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { ProductRepository } from './infrastructure/repositories/product-template.repository';

import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { PRODUCT_REPOSITORY } from './domain/repositories/product-template.repository.interface';

import {
  CategoryController,
  ProductTemplateController,
  ProductVariantController,
} from './presentation/catalog.controller';

import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { UpdateCategoryHandler } from './application/commands/update-category/update-category.handler';
import { RemoveCategoryHandler } from './application/commands/remove-category/remove-category.handler';
import { CreateProductTemplateHandler } from './application/commands/create-product-template/create-product-template.handler';
import { UpdateProductTemplateHandler } from './application/commands/update-product-template/update-product-template.handler';
import { RemoveProductTemplateHandler } from './application/commands/remove-product-template/remove-product-template.handler';
import { CreateProductVariantHandler } from './application/commands/create-product-variant/create-product-variant.handler';
import { UpdateProductVariantHandler } from './application/commands/update-product-variant/update-product-variant.handler';
import { RemoveProductVariantHandler } from './application/commands/remove-product-variant/remove-product-variant.handler';

import { GetAllCategoriesHandler } from './application/queries/get-all-categories/get-all-categories.handler';
import { GetCategoryByIdHandler } from './application/queries/get-category-by-id/get-category-by-id.handler';
import { GetCategoryChildrenHandler } from './application/queries/get-category-children/get-category-children.handler';
import { GetAllTemplatesHandler } from './application/queries/get-all-templates/get-all-templates.handler';
import { GetTemplateByIdHandler } from './application/queries/get-template-by-id/get-template-by-id.handler';
import { GetVariantByIdHandler } from './application/queries/get-variant-by-id/get-variant-by-id.handler';
import { GetVariantBySkuHandler } from './application/queries/get-variant-by-sku/get-variant-by-sku.handler';
import { GetVariantsByTemplateHandler } from './application/queries/get-variants-by-template/get-variants-by-template.handler';
import { GetVariantsBySpecsHandler } from './application/queries/get-variants-by-specs/get-variants-by-specs.handler';

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
      ProductTemplate,
      ProductVariant,
    ]),
  ],
  controllers: [
    CategoryController,
    ProductTemplateController,
    ProductVariantController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
  exports: [CATEGORY_REPOSITORY, PRODUCT_REPOSITORY, CqrsModule],
})
export class CatalogModule {}
