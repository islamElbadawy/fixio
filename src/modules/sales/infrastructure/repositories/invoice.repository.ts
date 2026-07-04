import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Invoice } from '../../domain/entities/invoice.aggregate';
import { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(
    @InjectRepository(Invoice)
    private readonly repo: EntityRepository<Invoice>,
  ) {}

  findById(id: string, populatePayments = false): Promise<Invoice | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      {
        populate: populatePayments
          ? ['customer', 'order', 'payments']
          : ['customer', 'order'],
      },
    );
  }

  findByOrderId(orderId: string): Promise<Invoice | null> {
    return this.repo.findOne(
      { order: { id: orderId }, isDeleted: false },
      { populate: ['customer', 'order', 'payments'] },
    );
  }

  findAll(customerId?: string): Promise<Invoice[]> {
    const where: Record<string, unknown> = { isDeleted: false };
    if (customerId) where['customer'] = { id: customerId };

    return this.repo.find(where, {
      populate: ['customer'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findLastInvoiceNumber(): Promise<string | null> {
    const year = new Date().getFullYear();
    const result = await this.repo.findOne(
      { invoiceNumber: { $like: `INV-${year}-%` } } as any,
      { orderBy: { invoiceNumber: 'DESC' } },
    );
    return result?.invoiceNumber ?? null;
  }

  async save(invoice: Invoice): Promise<void> {
     this.repo.getEntityManager().persist(invoice);
     await this.repo.getEntityManager().flush();
  }
}