import {
  Controller,
  Get,
  Post,
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../identity/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/infrastructure/guards/roles.guard';
import { Roles } from '../../identity/infrastructure/guards/roles.decorator';
import { CurrentUser } from '../../identity/infrastructure/guards/current-user.decorator';
import { UserRole } from '../../identity/domain/entities/role.enum';

import {
  CreateWorkOrderDto,
  AddWorkOrderLineDto,
  RecordPartConsumptionDto,
  CompleteWorkOrderDto,
} from '../application/dtos/work-order.dto';

import { CreateWorkOrderCommand } from '../application/commands/create-work-order/create-work-order.command';
import { AddWorkOrderLineCommand } from '../application/commands/add-work-order-line/add-work-order-line.command';
import { StartWorkOrderCommand } from '../application/commands/start-work-order/start-work-order.command';
import { RecordPartConsumptionCommand } from '../application/commands/record-part-consumption/record-part-consumption.command';
import { CompleteWorkOrderCommand } from '../application/commands/complete-work-order/complete-work-order.command';
import { CancelWorkOrderCommand } from '../application/commands/cancel-work-order/cancel-work-order.command';

import { GetWorkOrdersQuery } from '../application/queries/get-work-orders/get-work-orders.query';
import { GetWorkOrderByIdQuery } from '../application/queries/get-work-order-by-id/get-work-order-by-id.query';
import { GetVehicleWorkOrdersQuery } from '../application/queries/get-vehicle-work-orders/get-vehicle-work-orders.query';

@ApiTags('Workshop')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workshop')
export class WorkshopController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('work-orders')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @ApiOperation({ summary: 'Create a new work order' })
  createWorkOrder(
    @Body() dto: CreateWorkOrderDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CreateWorkOrderCommand(dto, actorId));
  }

  @Get('work-orders')
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiQuery({ name: 'vehicleId', required: false, type: String })
  getWorkOrders(@Query('vehicleId') vehicleId?: string) {
    return this.queryBus.execute(new GetWorkOrdersQuery(vehicleId));
  }

  @Get('work-orders/:id')
  @ApiOperation({ summary: 'Get work order by ID with lines' })
  getWorkOrderById(@Param('id') id: string) {
    return this.queryBus.execute(new GetWorkOrderByIdQuery(id));
  }

  @Get('vehicles/:vehicleId/work-orders')
  @ApiOperation({ summary: 'Get all work orders for a vehicle' })
  getVehicleWorkOrders(@Param('vehicleId') vehicleId: string) {
    return this.queryBus.execute(new GetVehicleWorkOrdersQuery(vehicleId));
  }

  @Post('work-orders/:id/lines')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @ApiOperation({ summary: 'Add a service or part line to a work order' })
  @ApiResponse({
    status: 422,
    description: 'Work order is completed or cancelled',
  })
  addLine(
    @Param('id') id: string,
    @Body() dto: AddWorkOrderLineDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(
      new AddWorkOrderLineCommand(id, dto, actorId),
    );
  }

  @Post('work-orders/:id/start')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a work order — assigns technician' })
  @ApiResponse({
    status: 422,
    description: 'Work order is not in DRAFT status',
  })
  startWorkOrder(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    return this.commandBus.execute(new StartWorkOrderCommand(id, actorId));
  }

  @Post('work-orders/:id/consume')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a part as consumed from inventory' })
  @ApiResponse({
    status: 422,
    description: 'Part already consumed or work order not in progress',
  })
  recordPartConsumption(
    @Param('id') id: string,
    @Body() dto: RecordPartConsumptionDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(
      new RecordPartConsumptionCommand(id, dto, actorId),
    );
  }

  @Post('work-orders/:id/complete')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete work order — auto-creates sales order' })
  @ApiResponse({
    status: 422,
    description: 'Work order not in progress or empty',
  })
  completeWorkOrder(
    @Param('id') id: string,
    @Body() dto: CompleteWorkOrderDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(
      new CompleteWorkOrderCommand(id, dto, actorId),
    );
  }

  @Post('work-orders/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.WORKSHOP_TECHNICIAN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a work order' })
  @ApiResponse({
    status: 422,
    description: 'Work order already completed or cancelled',
  })
  cancelWorkOrder(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    return this.commandBus.execute(new CancelWorkOrderCommand(id, actorId));
  }
}
