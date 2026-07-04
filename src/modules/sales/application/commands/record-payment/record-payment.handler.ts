import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RecordPaymentCommand } from './record-payment.command';
import {
  IInvoiceRepository,
  INVOICE_REPOSITORY,
} from '../../../domain/repositories/invoice.repository.interface';
import {
  IDomainEventBus,
  DOMAIN_EVENT_BUS,
} from '../../../../shared/contracts/domain-event-bus.interface';
import { AuditService } from '../../../../shared/infrastructure/audit/audit.service';
import { Payment } from '../../../domain/entities/payment.entity';

@CommandHandler(RecordPaymentCommand)
export class RecordPaymentHandler implements ICommandHandler<RecordPaymentCommand> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly eventBus: IDomainEventBus,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: RecordPaymentCommand): Promise<Payment> {
    const { invoiceId, dto, actorId } = command;

    const invoice = await this.invoiceRepo.findById(invoiceId, true);
    if (!invoice) throw new NotFoundException(`Invoice ${invoiceId} not found`);

    const payment = invoice.recordPayment(
      dto.amount,
      dto.method,
      actorId,
      dto.notes,
    );

    await this.invoiceRepo.save(invoice);

    await this.eventBus.publishAll(invoice.domainEvents);
    invoice.clearDomainEvents();

    await this.auditService.log(
      'Invoice',
      'PAYMENT_RECORDED',
      {
        invoiceId,
        amount: dto.amount,
        method: dto.method,
        remainingAmount: invoice.remainingAmount,
      },
      invoiceId,
      { actorId },
    );

    return payment;
  }
}
