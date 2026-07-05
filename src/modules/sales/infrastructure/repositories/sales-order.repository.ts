import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { SalesOrder } from '../../domain/entities/sales-order.aggregate';
import { SalesOrderLine } from '../../domain/entities/sales-order-line.entity';
import { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';

@Injectable()
export class SalesOrderRepository implements ISalesOrderRepository {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly repo: EntityRepository<SalesOrder>,
    @InjectRepository(SalesOrderLine)
    private readonly lineRepo: EntityRepository<SalesOrderLine>,
  ) {}

  private get em(): EntityManager {
    return this.repo.getEntityManager() as unknown as EntityManager;
  }

  async findById(
    id: string,
    populateLines = false,
  ): Promise<SalesOrder | null> {
    const order = await this.repo.findOne(
      { id, isDeleted: false },
      { populate: ['customer'] },
    );

    if (!order) return null;

    if (populateLines) {
      const lines = await this.lineRepo.find({ order: { id } } as any, {
        orderBy: { createdAt: 'ASC' },
      });
      order.lines.set(lines);
    }

    return order;
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
    this.em.persist(order);
    await this.em.flush();
  }
}
