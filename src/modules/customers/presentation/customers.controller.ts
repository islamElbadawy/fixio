import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../identity/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/infrastructure/guards/roles.guard';
import { Roles } from '../../identity/infrastructure/guards/roles.decorator';
import { CurrentUser } from '../../identity/infrastructure/guards/current-user.decorator';
import { UserRole } from '../../identity/domain/entities/role.enum';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../application/dtos/customer.dto';
import { CreateCustomerCommand } from '../application/commands/create-customer/create-customer.command';
import { UpdateCustomerCommand } from '../application/commands/update-customer/update-customer.command';
import { GetCustomersQuery } from '../application/queries/get-customers/get-customers.query';
import { GetCustomerByIdQuery } from '../application/queries/get-customer-by-id/get-customer-by-id.query';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({
    status: 409,
    description: 'Phone or email already registered',
  })
  createCustomer(
    @Body() dto: CreateCustomerDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CreateCustomerCommand(dto, actorId));
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  getCustomers() {
    return this.queryBus.execute(new GetCustomersQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getCustomerById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCustomerByIdQuery(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Update customer details' })
  updateCustomer(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new UpdateCustomerCommand(id, dto, actorId));
  }
}
