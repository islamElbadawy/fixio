import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SalesOrder } from '../../domain/entities/sales-order.aggregate';
import { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';

@Injectable()
export class SalesOrderRepository implements ISalesOrderRepository {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly repo: EntityRepository<SalesOrder>,
  ) {}

  findById(id: string, populateLines = false): Promise<SalesOrder | null> {
    return this.repo.findOne(
      { id, isDeleted: false },
      {
        populate: populateLines
          ? ['customer', 'lines']
          : ['customer'],
      },
    );
  }

  findByOrderNumber(orderNumber: string): Promise<SalesOrder | null> {
    return this.repo.findOne(
      { orderNumber, isDeleted: false },
      { populate: ['customer'] },
    );
  }

  findAll(customerId?: string): Promise<SalesOrder[]> {
    const where: Record<string, unknown> = { isDeleted: false };
    if (customerId) where['customer'] = { id: customerId };

    return this.repo.find(where, {
      populate: ['customer'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findLastOrderNumber(): Promise<string | null> {
    const year = new Date().getFullYear();
    const result = await this.repo.findOne(
      { orderNumber: { $like: `ORD-${year}-%` } } as any,
      { orderBy: { orderNumber: 'DESC' } },
    );
    return result?.orderNumber ?? null;
  }

  async save(order: SalesOrder): Promise<void> {
     this.repo.getEntityManager().persist(order);
     await this.repo.getEntityManager().flush();
  }
}