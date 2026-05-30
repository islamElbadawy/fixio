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
import { CategoryCommands } from '../application/commands/category.commands';
import { CategoryQueries } from '../application/queries/category.queries';
import { CreateCategoryDto, UpdateCategoryDto } from '../application/dtos/category.dto';

@ApiTags('Catalog')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog')
export class CategoryController {
  constructor(
    private readonly categoryCommands: CategoryCommands,
    private readonly queries: CategoryQueries,
  ) {}

  @Post('categories')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 409, description: 'Slug already in use' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryCommands.create(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  getAllCategories() {
    return this.queries.getAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getCategoryById(@Param('id') id: string) {
    return this.queries.getCategoryById(id);
  }

  @Get('categories/:id/children')
  @ApiOperation({ summary: 'Get subcategories of a category' })
  getCategoryChildren(@Param('id') id: string) {
    return this.queries.getCategoryChildren(id);
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update a category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryCommands.update(id, dto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a category' })
  removeCategory(@Param('id') id: string) {
    return this.categoryCommands.remove(id);
  }
}
