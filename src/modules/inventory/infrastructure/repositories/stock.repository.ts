import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Stock } from '../../domain/entities/stock.aggregate';
import { InventoryTransactionEntity } from '../../domain/entities/inventory-transaction.entity';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { INBOUND_TYPES } from '../../domain/entities/transaction-type.enum';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(InventoryTransactionEntity)
    private readonly txRepo: EntityRepository<InventoryTransactionEntity>,

    @InjectRepository(StockReservationEntity)
    private readonly reservationRepo: EntityRepository<StockReservationEntity>,

    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: EntityRepository<WarehouseEntity>,
  ) {}

  private get em(): EntityManager {
    return this.txRepo.getEntityManager() as unknown as EntityManager;
  }

  async load(variantId: string, warehouseId: string): Promise<Stock> {
    const warehouse = await this.warehouseRepo.findOneOrFail(
      { id: warehouseId, isDeleted: false },
    );

    const transactions = await this.txRepo.find(
      { variantId, warehouse: { id: warehouseId } },
      { orderBy: { createdAt: 'ASC' } },
    );

    const now = new Date();
    const reservations = await this.reservationRepo.find({
      variantId,
      warehouse: { id: warehouseId },
      isActive: true,
      isDeleted: false,
    });

    return new Stock(variantId, warehouse, transactions, reservations);
  }

  async saveTransactions(
    transactions: InventoryTransactionEntity[],
  ): Promise<void> {
    if (transactions.length === 0) return;
    for (const tx of transactions) {
      this.em.persist(tx);
    }
    await this.em.flush();
  }

  async saveReservations(
    reservations: StockReservationEntity[],
  ): Promise<void> {
    if (reservations.length === 0) return;
    for (const r of reservations) {
      this.em.persist(r);
    }
    await this.em.flush();
  }

  async findReservationById(
    id: string,
  ): Promise<StockReservationEntity | null> {
    return this.reservationRepo.findOne(
      { id, isActive: true, isDeleted: false },
      { populate: ['warehouse'] },
    );
  }

  async getStockLevel(
    variantId: string,
    warehouseId: string,
  ): Promise<{ onHand: number; reserved: number; available: number }> {
    const inboundTypes = INBOUND_TYPES.map(t => `'${t}'`).join(',');

    const result = await this.em.getConnection().execute(`
      SELECT
        COALESCE(SUM(CASE WHEN type IN (${inboundTypes}) THEN quantity ELSE -quantity END), 0) AS on_hand,
        COALESCE((
          SELECT SUM(quantity)
          FROM stock_reservations
          WHERE variant_id = $1
            AND warehouse_id = $2
            AND is_active = true
            AND is_deleted = false
            AND (expires_at IS NULL OR expires_at > NOW())
        ), 0) AS reserved
      FROM inventory_transactions
      WHERE variant_id = $1
        AND warehouse_id = $2
    `, [variantId, warehouseId]);

    const row = result[0];
    const onHand = Number(row.on_hand);
    const reserved = Number(row.reserved);
    const available = Math.max(0, onHand - reserved);

    return { onHand, reserved, available };
  }

  async getTransactions(
    variantId: string,
    warehouseId?: string,
    limit = 50,
  ): Promise<InventoryTransactionEntity[]> {
    const where: Record<string, unknown> = { variantId };
    if (warehouseId) where['warehouse'] = { id: warehouseId };

    return this.txRepo.find(where, {
      populate: ['warehouse'],
      orderBy: { createdAt: 'DESC' },
      limit,
    });
  }
}