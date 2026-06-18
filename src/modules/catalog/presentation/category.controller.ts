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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../identity/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/infrastructure/guards/roles.guard';
import { Roles } from '../../identity/infrastructure/guards/roles.decorator';
import { UserRole } from '../../identity/domain/entities/role.enum';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../application/dtos/category.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../application/commands/create-category/create-category.command';
import { GetAllCategoriesQuery } from '../application/queries/get-all-categories/get-all-categories.query';
import { GetCategoryByIdQuery } from '../application/queries/get-category-by-id/get-category-by-id.query';
import { GetCategoryChildrenQuery } from '../application/queries/get-category-children/get-category-children.query';
import { UpdateCategoryCommand } from '../application/commands/update-category/update-category.command';
import { RemoveCategoryCommand } from '../application/commands/remove-category/remove-category.command';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('categories')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 409, description: 'Slug already in use' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(new CreateCategoryCommand(dto));
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  getAllCategories() {
    return this.queryBus.execute(new GetAllCategoriesQuery());
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getCategoryById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id));
  }

  @Get('categories/:id/children')
  @ApiOperation({ summary: 'Get subcategories of a category' })
  getCategoryChildren(@Param('id') id: string) {
    return this.queryBus.execute(new GetCategoryChildrenQuery(id));
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, dto));
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a category' })
  removeCategory(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveCategoryCommand(id));
  }
}
