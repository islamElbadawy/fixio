import { Stock } from '../entities/stock.aggregate';
import { InventoryTransactionEntity } from '../entities/inventory-transaction.entity';
import { StockReservationEntity } from '../entities/stock-reservation.entity';

export const STOCK_REPOSITORY = Symbol('IStockRepository');

export interface IStockRepository {
  // Load the Stock aggregate for a variant+warehouse
  load(variantId: string, warehouseId: string): Promise<Stock>;

  // Persist new transactions produced by the aggregate
  saveTransactions(transactions: InventoryTransactionEntity[]): Promise<void>;

  // Persist reservations produced by the aggregate
  saveReservations(reservations: StockReservationEntity[]): Promise<void>;

  // Get a single reservation by ID
  findReservationById(id: string): Promise<StockReservationEntity | null>;

  // Raw stock level query — used by queries without loading full aggregate
  getStockLevel(
    variantId: string,
    warehouseId: string,
  ): Promise<{
    onHand: number;
    reserved: number;
    available: number;
  }>;

  // Ledger history for a variant
  getTransactions(
    variantId: string,
    warehouseId?: string,
    limit?: number,
  ): Promise<InventoryTransactionEntity[]>;
}
