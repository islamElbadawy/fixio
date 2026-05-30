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
import { ProductVariantCommands } from '../application/commands/product-variant.commands';
import { ProductVariantQueries } from '../application/queries/product-variant.queries';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  FilterVariantBySpecsDto,
} from '../application/dtos/product-variant.dto';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class ProductVariantController {
  constructor(
    private readonly variantCommands: ProductVariantCommands,
    private readonly queries: ProductVariantQueries,
  ) {}

  @Post('variants')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a product variant' })
  @ApiResponse({ status: 409, description: 'SKU already in use' })
  createVariant(@Body() dto: CreateProductVariantDto) {
    return this.variantCommands.create(dto);
  }

  @Get('variants/sku/:sku')
  @ApiOperation({ summary: 'Get variant by SKU' })
  getVariantBySku(@Param('sku') sku: string) {
    return this.queries.getVariantBySku(sku);
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
  searchVariantsBySpecs(@Query('filters') filtersJson: string) {
    const filters = JSON.parse(filtersJson);
    return this.queries.getVariantsBySpecs(filters);
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get variant by ID' })
  getVariantById(@Param('id') id: string) {
    return this.queries.getVariantById(id);
  }

  @Get('templates/:id/variants')
  @ApiOperation({ summary: 'Get all variants of a template' })
  getVariantsByTemplate(@Param('id') id: string) {
    return this.queries.getVariantsByTemplate(id);
  }

  @Post('variants/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search variants by specs (POST body)' })
  searchVariantsBySpecsPost(@Body() dto: FilterVariantBySpecsDto) {
    return this.queries.getVariantsBySpecs(dto.filters);
  }

  @Patch('variants/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a product variant' })
  updateVariant(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.variantCommands.update(id, dto);
  }

  @Delete('variants/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product variant' })
  removeVariant(@Param('id') id: string) {
    return this.variantCommands.remove(id);
  }
}
