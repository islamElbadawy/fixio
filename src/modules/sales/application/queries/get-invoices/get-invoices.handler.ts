import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import {
  INVOICE_REPOSITORY,
  IInvoiceRepository,
} from 'src/modules/sales/domain/repositories/invoice.repository.interface';
import { GetInvoicesQuery } from './get-invoices.query';

@QueryHandler(GetInvoicesQuery)
export class GetInvoicesHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
  ) {}

  async execute(query: GetInvoicesQuery) {
    const customerId = query.customerId;
    return this.invoiceRepo.findAll(customerId);
  }
}
