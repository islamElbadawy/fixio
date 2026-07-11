import { WorkOrder } from '../entities/work-order.aggregate';

export const WORK_ORDER_REPOSITORY = Symbol('IWorkOrderRepository');

export interface IWorkOrderRepository {
  findById(id: string, populateLines?: boolean): Promise<WorkOrder | null>;
  findByWorkOrderNumber(number: string): Promise<WorkOrder | null>;
  findAll(vehicleId?: string): Promise<WorkOrder[]>;
  findByVehicle(vehicleId: string): Promise<WorkOrder[]>;
  findLastWorkOrderNumber(): Promise<string | null>;
  save(workOrder: WorkOrder): Promise<void>;
}
