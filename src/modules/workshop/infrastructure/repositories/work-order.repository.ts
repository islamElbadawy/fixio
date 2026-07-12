import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { WorkOrder } from '../../domain/entities/work-order.aggregate';
import { WorkOrderLine } from '../../domain/entities/work-order-line.entity';
import { IWorkOrderRepository } from '../../domain/repositories/work-order.repository.interface';

@Injectable()
export class WorkOrderRepository implements IWorkOrderRepository {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly repo: EntityRepository<WorkOrder>,
    @InjectRepository(WorkOrderLine)
    private readonly lineRepo: EntityRepository<WorkOrderLine>,
  ) {}

  private get em(): EntityManager {
    return this.repo.getEntityManager() as unknown as EntityManager;
  }

  async findById(id: string, populateLines = false): Promise<WorkOrder | null> {
    const workOrder = await this.repo.findOne(
      { id, isDeleted: false },
      { populate: ['vehicle', 'customer'] },
    );

    if (!workOrder) return null;

    if (populateLines) {
      const lines = await this.lineRepo.find({ workOrder: { id } } as any, {
        orderBy: { createdAt: 'ASC' },
      });
      workOrder.lines.set(lines);
    }

    return workOrder;
  }

  findByWorkOrderNumber(number: string): Promise<WorkOrder | null> {
    return this.repo.findOne(
      { workOrderNumber: number, isDeleted: false },
      { populate: ['vehicle', 'customer'] },
    );
  }

  findAll(vehicleId?: string): Promise<WorkOrder[]> {
    const where: Record<string, unknown> = { isDeleted: false };
    if (vehicleId) where['vehicle'] = { id: vehicleId };

    return this.repo.find(where, {
      populate: ['vehicle', 'customer'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  findByVehicle(vehicleId: string): Promise<WorkOrder[]> {
    return this.repo.find(
      { vehicle: { id: vehicleId }, isDeleted: false },
      {
        populate: ['vehicle', 'customer'],
        orderBy: { createdAt: 'DESC' },
      },
    );
  }

  async findLastWorkOrderNumber(): Promise<string | null> {
    const year = new Date().getFullYear();
    const result = await this.repo.findOne(
      { workOrderNumber: { $like: `WO-${year}-%` } } as any,
      { orderBy: { workOrderNumber: 'DESC' } },
    );
    return result?.workOrderNumber ?? null;
  }

  async save(workOrder: WorkOrder): Promise<void> {
    this.em.persist(workOrder);
    this.em.flush();
  }
}
