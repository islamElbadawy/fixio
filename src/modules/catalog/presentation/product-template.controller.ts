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
import {
  CreateProductTemplateDto,
  UpdateProductTemplateDto,
} from '../application/dtos/product-template.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductTemplateCommand } from '../application/commands/create-product-template/create-product-template.command';
import { GetAllTemplatesQuery } from '../application/queries/get-all-templates/get-all-templates.query';
import { GetTemplateByIdQuery } from '../application/queries/get-template-by-id/get-template-by-id.query';
import { UpdateProductTemplateCommand } from '../application/commands/update-product-template/update-product-template.command';
import { RemoveProductTemplateCommand } from '../application/commands/remove-product-template/remove-product-template.command';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class ProductTemplateController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('templates')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a product template' })
  @ApiResponse({ status: 409, description: 'Slug already in use' })
  createTemplate(@Body() dto: CreateProductTemplateDto) {
    return this.commandBus.execute(new CreateProductTemplateCommand(dto));
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all product templates' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  getAllTemplates(@Query('categoryId') categoryId?: string) {
    return this.queryBus.execute(new GetAllTemplatesQuery(categoryId));
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get product template by ID' })
  getTemplateById(@Param('id') id: string) {
    return this.queryBus.execute(new GetTemplateByIdQuery(id));
  }

  @Patch('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a product template' })
  updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateProductTemplateDto,
  ) {
    return this.commandBus.execute(new UpdateProductTemplateCommand(id, dto));
  }

  @Delete('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product template' })
  removeTemplate(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveProductTemplateCommand(id));
  }
}
