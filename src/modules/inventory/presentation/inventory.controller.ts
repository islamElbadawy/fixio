import {
  Controller,
  Get,
  Post,
  Patch,
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
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../application/dtos/warehouse.dto';
import {
  ReceiveStockDto,
  AdjustStockDto,
  ReserveStockDto,
  ReleaseReservationDto,
  ConfirmReservationDto,
} from '../application/dtos/stock.dto';

import { CreateWarehouseCommand } from '../application/commands/create-warehouse/create-warehouse.command';
import { ReceiveStockCommand } from '../application/commands/receive-stock/receive-stock.command';
import { AdjustStockCommand } from '../application/commands/adjust-stock/adjust-stock.command';
import { ReserveStockCommand } from '../application/commands/reserve-stock/reserve-stock.command';
import { ReleaseReservationCommand } from '../application/commands/release-reservation/release-reservation.command';
import { ConfirmReservationCommand } from '../application/commands/confirm-reservation/confirm-reservation.command';

import { GetWarehousesQuery } from '../application/queries/get-warehouses/get-warehouses.query';
import { GetStockLevelQuery } from '../application/queries/get-stock-level/get-stock-level.query';
import { GetStockMovementsQuery } from '../application/queries/get-stock-movements/get-stock-movements.query';

@ApiTags('Inventory')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ─── Warehouses ───────────────────────────────────────────

  @Post('warehouses')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created' })
  createWarehouse(
    @Body() dto: CreateWarehouseDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CreateWarehouseCommand(dto, actorId));
  }

  @Get('warehouses')
  @ApiOperation({ summary: 'Get all warehouses' })
  getWarehouses() {
    return this.queryBus.execute(new GetWarehousesQuery());
  }

  // ─── Stock operations ─────────────────────────────────────

  @Post('receive')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Receive stock from a purchase order' })
  @ApiResponse({
    status: 201,
    description: 'Stock received and ledger entry created',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  receiveStock(
    @Body() dto: ReceiveStockDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new ReceiveStockCommand(dto, actorId));
  }

  @Post('adjust')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Adjust stock — manual correction up or down' })
  @ApiResponse({ status: 201, description: 'Adjustment recorded in ledger' })
  @ApiResponse({
    status: 422,
    description: 'Insufficient stock for outbound adjustment',
  })
  adjustStock(@Body() dto: AdjustStockDto, @CurrentUser('id') actorId: string) {
    return this.commandBus.execute(new AdjustStockCommand(dto, actorId));
  }

  @Post('reserve')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Reserve stock for a sales order' })
  @ApiResponse({ status: 201, description: 'Stock reserved' })
  @ApiResponse({ status: 422, description: 'Insufficient stock available' })
  reserveStock(
    @Body() dto: ReserveStockDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new ReserveStockCommand(dto, actorId));
  }

  @Post('reservations/release')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.SALES_EMPLOYEE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Release a stock reservation' })
  @ApiResponse({ status: 204, description: 'Reservation released' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  releaseReservation(
    @Body() dto: ReleaseReservationDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new ReleaseReservationCommand(dto, actorId));
  }

  @Post('reservations/confirm')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.SALES_EMPLOYEE)
  @ApiOperation({
    summary: 'Confirm a reservation — converts to SALE ledger entry',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation confirmed, SALE transaction created',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  confirmReservation(
    @Body() dto: ConfirmReservationDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new ConfirmReservationCommand(dto, actorId));
  }

  // ─── Stock queries ────────────────────────────────────────

  @Get('stock')
  @ApiOperation({ summary: 'Get stock level for a variant in a warehouse' })
  @ApiQuery({ name: 'variantId', required: true, type: String })
  @ApiQuery({ name: 'warehouseId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Stock level: onHand, reserved, available',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  getStockLevel(
    @Query('variantId') variantId: string,
    @Query('warehouseId') warehouseId: string,
  ) {
    return this.queryBus.execute(
      new GetStockLevelQuery(variantId, warehouseId),
    );
  }

  @Get('movements')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get ledger history for a variant' })
  @ApiQuery({ name: 'variantId', required: true, type: String })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getStockMovements(
    @Query('variantId') variantId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new GetStockMovementsQuery(variantId, warehouseId, limit),
    );
  }
}
