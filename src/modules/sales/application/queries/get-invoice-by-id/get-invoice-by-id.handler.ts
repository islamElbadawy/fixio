import { QueryHandler } from '@nestjs/cqrs';
import { GetInvoiceByIdQuery } from './get-invoice-by-id.query';
import { IInvoiceRepository } from 'src/modules/sales/domain/repositories/invoice.repository.interface';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetInvoiceByIdQuery)
export class GetInvoiceByIdHandler {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(query: GetInvoiceByIdQuery) {
    const invoiceId = query.id;
    const invoice = await this.invoiceRepo.findById(invoiceId, true);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    return invoice;
  }
}
