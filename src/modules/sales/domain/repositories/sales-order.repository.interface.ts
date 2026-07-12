import { SalesOrder } from '../entities/sales-order.aggregate';

export const SALES_ORDER_REPOSITORY = Symbol('ISalesOrderRepository');

export interface ISalesOrderRepository {
  findById(id: string, populateLines?: boolean): Promise<SalesOrder | null>;
  findByOrderNumber(orderNumber: string): Promise<SalesOrder | null>;
  findAll(customerId?: string): Promise<SalesOrder[]>;
  findLastOrderNumber(): Promise<string | null>;
  save(order: SalesOrder): Promise<void>;
}
