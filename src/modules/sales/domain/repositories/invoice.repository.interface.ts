import { Invoice } from '../entities/invoice.aggregate';

export const INVOICE_REPOSITORY = Symbol('IInvoiceRepository');

export interface IInvoiceRepository {
  findById(id: string, populatePayments?: boolean): Promise<Invoice | null>;
  findByOrderId(orderId: string): Promise<Invoice | null>;
  findAll(customerId?: string): Promise<Invoice[]>;
  findLastInvoiceNumber(): Promise<string | null>;
  save(invoice: Invoice): Promise<void>;
}
