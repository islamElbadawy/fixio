import { QueryHandler } from '@nestjs/cqrs';
import { GetInvoiceByIdQuery } from './get-invoice-by-id.query';
import { IInvoiceRepository } from 'src/modules/sales/domain/repositories/invoice.repository.interface';

@QueryHandler(GetInvoiceByIdQuery)
export class GetInvoiceByIdHandler {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(query: GetInvoiceByIdQuery) {
    const invoiceId = query.id;
    return this.invoiceRepo.findById(invoiceId);
  }
}
