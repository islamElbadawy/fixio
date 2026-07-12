import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetInvoiceByIdQuery } from './get-invoice-by-id.query';
import {
  IInvoiceRepository,
  INVOICE_REPOSITORY,
} from '../../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../../domain/entities/invoice.aggregate';

@QueryHandler(GetInvoiceByIdQuery)
export class GetInvoiceByIdHandler implements IQueryHandler<GetInvoiceByIdQuery> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
  ) {}

  async execute(query: GetInvoiceByIdQuery): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findById(query.id, true);
    if (!invoice) throw new NotFoundException(`Invoice ${query.id} not found`);
    return invoice;
  }
}
