import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../identity/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/infrastructure/guards/roles.guard';
import { Roles } from '../../identity/infrastructure/guards/roles.decorator';
import { CurrentUser } from '../../identity/infrastructure/guards/current-user.decorator';
import { UserRole } from '../../identity/domain/entities/role.enum';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
} from '../application/dtos/vehicle.dto';
import { CreateVehicleCommand } from '../application/commands/create-vehicle/create-vehicle.command';
import { UpdateVehicleCommand } from '../application/commands/update-vehicle/update-vehicle.command';
import { GetVehiclesQuery } from '../application/queries/get-vehicles/get-vehicles.query';
import { GetVehicleByIdQuery } from '../application/queries/get-vehicle-by-id/get-vehicle-by-id.query';

@ApiTags('Vehicles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Register a new vehicle' })
  createVehicle(
    @Body() dto: CreateVehicleDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CreateVehicleCommand(dto, actorId));
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  getVehicles(@Query('customerId') customerId?: string) {
    return this.queryBus.execute(new GetVehiclesQuery(customerId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  getVehicleById(@Param('id') id: string) {
    return this.queryBus.execute(new GetVehicleByIdQuery(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Update vehicle details' })
  updateVehicle(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new UpdateVehicleCommand(id, dto, actorId));
  }
}
