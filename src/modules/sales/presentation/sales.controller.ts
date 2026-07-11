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
  CreateSalesOrderDto,
  AddOrderLineDto,
  GenerateInvoiceDto,
} from '../application/dtos/sales-order.dto';
import { RecordPaymentDto } from '../application/dtos/invoice.dto';

import { CreateOrderCommand } from '../application/commands/create-order/create-order.command';
import { AddOrderLineCommand } from '../application/commands/add-order-line/add-order-line.command';
import { ConfirmOrderCommand } from '../application/commands/confirm-order/confirm-order.command';
import { GenerateInvoiceCommand } from '../application/commands/generate-invoice/generate-invoice.command';
import { RecordPaymentCommand } from '../application/commands/record-payment/record-payment.command';
import { CancelOrderCommand } from '../application/commands/cancel-order/cancel-order.command';

import { GetOrdersQuery } from '../application/queries/get-orders/get-orders.query';
import { GetOrderByIdQuery } from '../application/queries/get-order-by-id/get-order-by-id.query';
import { GetInvoicesQuery } from '../application/queries/get-invoices/get-invoices.query';
import { GetInvoiceByIdQuery } from '../application/queries/get-invoice-by-id/get-invoice-by-id.query';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ─── Orders ───────────────────────────────────────────────

  @Post('orders')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Create a new sales order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  createOrder(
    @Body() dto: CreateSalesOrderDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CreateOrderCommand(dto, actorId));
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all sales orders' })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  getOrders(@Query('customerId') customerId?: string) {
    return this.queryBus.execute(new GetOrdersQuery(customerId));
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID with lines' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderById(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrderByIdQuery(id));
  }

  @Post('orders/:id/lines')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @ApiOperation({ summary: 'Add a line to a draft order' })
  @ApiResponse({ status: 422, description: 'Order is not in DRAFT status' })
  addOrderLine(
    @Param('id') id: string,
    @Body() dto: AddOrderLineDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new AddOrderLineCommand(id, dto, actorId));
  }

  @Post('orders/:id/confirm')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm order — reserves stock for all lines' })
  @ApiResponse({ status: 422, description: 'Order empty or already confirmed' })
  confirmOrder(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new ConfirmOrderCommand(id, actorId));
  }

  @Post('orders/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel order — releases all stock reservations' })
  @ApiResponse({ status: 422, description: 'Order already invoiced or cancelled' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new CancelOrderCommand(id, actorId));
  }

  @Post('orders/:id/invoice')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Generate invoice from confirmed order' })
  @ApiResponse({ status: 422, description: 'Order not confirmed' })
  @ApiResponse({ status: 409, description: 'Invoice already exists' })
  generateInvoice(
    @Param('id') id: string,
    @Body() dto: GenerateInvoiceDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new GenerateInvoiceCommand(id, dto, actorId));
  }

  // ─── Invoices ─────────────────────────────────────────────

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  getInvoices(@Query('customerId') customerId?: string) {
    return this.queryBus.execute(new GetInvoicesQuery(customerId));
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID with payments' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  getInvoiceById(@Param('id') id: string) {
    return this.queryBus.execute(new GetInvoiceByIdQuery(id));
  }

  @Post('invoices/:id/payments')
  @Roles(UserRole.ADMIN, UserRole.SALES_EMPLOYEE, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Record a payment against an invoice' })
  @ApiResponse({ status: 422, description: 'Invoice paid or overpayment attempted' })
  recordPayment(
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.commandBus.execute(new RecordPaymentCommand(id, dto, actorId));
  }
}