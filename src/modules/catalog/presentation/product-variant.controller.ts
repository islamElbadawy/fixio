import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../identity/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/infrastructure/guards/roles.guard';
import { Roles } from '../../identity/infrastructure/guards/roles.decorator';
import { UserRole } from '../../identity/domain/entities/role.enum';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  FilterVariantBySpecsDto,
} from '../application/dtos/product-variant.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductVariantCommand } from '../application/commands/create-product-variant/create-product-variant.command';
import { GetVariantBySkuQuery } from '../application/queries/get-variant-by-sku/get-variant-by-sku.query';
import { GetVariantsBySpecsQuery } from '../application/queries/get-variants-by-specs/get-variants-by-specs.query';
import { GetVariantByIdQuery } from '../application/queries/get-variant-by-id/get-variant-by-id.query';
import { GetVariantsByTemplateQuery } from '../application/queries/get-variants-by-template/get-variants-by-template.query';
import { UpdateProductVariantCommand } from '../application/commands/update-product-variant/update-product-variant.command';
import { RemoveProductVariantCommand } from '../application/commands/remove-product-variant/remove-product-variant.command';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class ProductVariantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('variants')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a product variant' })
  @ApiResponse({ status: 409, description: 'SKU already in use' })
  createVariant(@Body() dto: CreateProductVariantDto) {
    return this.commandBus.execute(new CreateProductVariantCommand(dto));
  }

  @Get('variants/sku/:sku')
  @ApiOperation({ summary: 'Get variant by SKU' })
  getVariantBySku(@Param('sku') sku: string) {
    return this.queryBus.execute(new GetVariantBySkuQuery(sku));
  }

  @Get('variants/search')
  @ApiOperation({ summary: 'Search variants by specs' })
  @ApiQuery({
    name: 'filters',
    required: true,
    type: String,
    description:
      'JSON string of spec filters e.g. {"compatibility":"Toyota Corolla"}',
  })
  searchVariantsBySpecs(@Query('filters') filtersJson: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    let filters: Record<string, unknown>;
    try {
      filters = JSON.parse(filtersJson);
    } catch (e) {
      throw new BadRequestException('Invalid JSON in filters query parameter');
    }

    if (!filters || typeof filters !== 'object' || Array.isArray(filters)) {
      throw new BadRequestException('Filters must be a JSON object');
    }

    const allowedKeys = ['compatibility', 'brand', 'year'];
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      throw new BadRequestException('At least one filter key is required');
    }
    if (keys.length > 10) {
      throw new BadRequestException('Too many filter keys');
    }
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Invalid filter keys: ${invalidKeys.join(', ')}`);
    }

    const l = limit ? parseInt(limit, 10) : undefined;
    const o = offset ? parseInt(offset, 10) : undefined;
    return this.queryBus.execute(new GetVariantsBySpecsQuery(filters, l, o));
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get variant by ID' })
  getVariantById(@Param('id') id: string) {
    return this.queryBus.execute(new GetVariantByIdQuery(id));
  }

  @Get('templates/:id/variants')
  @ApiOperation({ summary: 'Get all variants of a template' })
  getVariantsByTemplate(@Param('id') id: string) {
    return this.queryBus.execute(new GetVariantsByTemplateQuery(id));
  }

  @Post('variants/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search variants by specs (POST body)' })
  searchVariantsBySpecsPost(@Body() dto: FilterVariantBySpecsDto) {
    const l = dto.limit;
    const o = dto.offset;
    return this.queryBus.execute(new GetVariantsBySpecsQuery(dto.filters, l, o));
  }

  @Patch('variants/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a product variant' })
  updateVariant(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.commandBus.execute(new UpdateProductVariantCommand(id, dto));
  }

  @Delete('variants/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product variant' })
  removeVariant(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveProductVariantCommand(id));
  }
}
