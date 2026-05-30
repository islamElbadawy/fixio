import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
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
import { ProductTemplateCommands } from '../application/commands/product-template.commands';
import { ProductTemplateQueries } from '../application/queries/product-template.queries';
import { CreateProductTemplateDto, UpdateProductTemplateDto } from '../application/dtos/product-template.dto';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class ProductTemplateController {
  constructor(
    private readonly templateCommands: ProductTemplateCommands,
    private readonly queries: ProductTemplateQueries,
  ) {}

  @Post('templates')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a product template' })
  @ApiResponse({ status: 409, description: 'Slug already in use' })
  createTemplate(@Body() dto: CreateProductTemplateDto) {
    return this.templateCommands.create(dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all product templates' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  getAllTemplates(@Query('categoryId') categoryId?: string) {
    return this.queries.getAllTemplates(categoryId);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get product template by ID' })
  getTemplateById(@Param('id') id: string) {
    return this.queries.getTemplateById(id);
  }

  @Patch('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a product template' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateProductTemplateDto) {
    return this.templateCommands.update(id, dto);
  }

  @Delete('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product template' })
  removeTemplate(@Param('id') id: string) {
    return this.templateCommands.remove(id);
  }
}
