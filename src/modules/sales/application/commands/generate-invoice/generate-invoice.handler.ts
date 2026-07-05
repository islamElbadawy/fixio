import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { GenerateInvoiceCommand } from './generate-invoice.command';
import {
  ISalesOrderRepository,
  SALES_ORDER_REPOSITORY,
} from '../../../domain/repositories/sales-order.repository.interface';
import {
  IInvoiceRepository,
  INVOICE_REPOSITORY,
} from '../../../domain/repositories/invoice.repository.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { Invoice } from '../../../domain/entities/invoice.aggregate';
import { generateInvoiceNumber } from '../../utils/number-generator.util';
import { OrderStatus } from '../../../domain/entities/order-status.enum';
import { DomainException } from '../../../../shared/domain/exceptions/domain.exception';

@CommandHandler(GenerateInvoiceCommand)
export class GenerateInvoiceHandler implements ICommandHandler<GenerateInvoiceCommand> {
  constructor(
    @Inject(SALES_ORDER_REPOSITORY)
    private readonly orderRepo: ISalesOrderRepository,
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: GenerateInvoiceCommand): Promise<Invoice> {
    const { orderId, dto, actorId } = command;

    const order = await this.orderRepo.findById(orderId, true);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (!order.lines.isInitialized()) {
      await order.lines.init();
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new DomainException(
        `Order ${orderId} must be confirmed before generating an invoice`,
      );
    }

    const existingInvoice = await this.invoiceRepo.findByOrderId(orderId);
    if (existingInvoice) {
      throw new ConflictException(
        `Invoice already exists for order ${orderId}`,
      );
    }

    const lastNumber = await this.invoiceRepo.findLastInvoiceNumber();
    const invoiceNumber = generateInvoiceNumber(lastNumber);

    const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;

    const invoice = Invoice.create(
      invoiceNumber,
      order,
      order.customer as any,
      order.totalAmount,
      dueDate,
    );

    order.markAsInvoiced();

    await this.orderRepo.save(order);
    await this.invoiceRepo.save(invoice);

    await this.auditService.log(
      'Invoice',
      'GENERATED',
      { invoiceNumber, orderId, totalAmount: order.totalAmount },
      invoice.id,
      { actorId },
    );

    return invoice;
  }
}
