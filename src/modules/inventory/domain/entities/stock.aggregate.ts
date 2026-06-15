import { v4 as uuidv4 } from 'uuid';
import { AggregateRootBase } from '../../../shared/infrastructure/database/aggregate-root.base';
import { InventoryTransactionEntity } from './inventory-transaction.entity';
import { StockReservationEntity } from './stock-reservation.entity';
import { WarehouseEntity } from './warehouse.entity';
import { TransactionType, INBOUND_TYPES } from './transaction-type.enum';
import { InsufficientStockException } from '../exceptions/insufficient-stock.exception';
import { StockReservedEvent } from '../events/stock-reserved.event';
import { StockAdjustedEvent } from '../events/stock-adjusted.event';
import { ReservationReleasedEvent } from '../events/reservation-released.event';
import { StockReceivedEvent } from '../events/stock-received.event';

export interface StockLevel {
  onHand: number;
  reserved: number;
  available: number;
}

export class Stock extends AggregateRootBase {
  private readonly variantId: string;
  private readonly warehouse: WarehouseEntity;
  private transactions: InventoryTransactionEntity[];
  private reservations: StockReservationEntity[];

  constructor(
    variantId: string,
    warehouse: WarehouseEntity,
    transactions: InventoryTransactionEntity[] = [],
    reservations: StockReservationEntity[] = [],
  ) {
    super();
    this.variantId = variantId;
    this.warehouse = warehouse;
    this.transactions = transactions;
    this.reservations = reservations;
  }

  // ─── Stock calculation ────────────────────────────────────

  getLevel(): StockLevel {
    const onHand = this.calculateOnHand();
    const reserved = this.calculateReserved();
    const available = Math.max(0, onHand - reserved);
    return { onHand, reserved, available };
  }

  private calculateOnHand(): number {
    return this.transactions.reduce((sum, tx) => {
      const isInbound = INBOUND_TYPES.includes(tx.type);
      return isInbound ? sum + Number(tx.quantity) : sum - Number(tx.quantity);
    }, 0);
  }

  private calculateReserved(): number {
    const now = new Date();
    return this.reservations
      .filter(
        (r) =>
          r.isActive &&
          !r.isDeleted &&
          (r.expiresAt === null || r.expiresAt > now),
      )
      .reduce((sum, r) => sum + Number(r.quantity), 0);
  }

  // ─── Commands ─────────────────────────────────────────────

  reserve(
    quantity: number,
    referenceId: string | null = null,
    referenceType: string | null = null,
    expiresAt: Date | null = null,
    actorId: string | null = null,
  ): StockReservationEntity {
    const { available } = this.getLevel();

    if (quantity <= 0) {
      throw new InsufficientStockException(
        this.variantId,
        this.warehouse.id,
        quantity,
        available,
      );
    }

    if (available < quantity) {
      throw new InsufficientStockException(
        this.variantId,
        this.warehouse.id,
        quantity,
        available,
      );
    }

    const reservation = new StockReservationEntity();
    reservation.id = uuidv4();
    reservation.variantId = this.variantId;
    reservation.warehouse = this.warehouse;
    reservation.quantity = quantity;
    reservation.referenceId = referenceId;
    reservation.referenceType = referenceType;
    reservation.expiresAt = expiresAt;
    reservation.isActive = true;

    this.reservations.push(reservation);

    this.addDomainEvent(
      new StockReservedEvent(
        this.variantId,
        this.warehouse.id,
        quantity,
        reservation.id,
        referenceId,
        referenceType,
      ),
    );

    return reservation;
  }

  releaseReservation(reservationId: string): void {
    const reservation = this.reservations.find((r) => r.id === reservationId);

    if (!reservation || !reservation.isActive) {
      throw new Error(
        `Reservation ${reservationId} not found or already released`,
      );
    }

    reservation.isActive = false;
    reservation.isDeleted = true;
    reservation.deletedAt = new Date();

    this.addDomainEvent(
      new ReservationReleasedEvent(
        reservationId,
        this.variantId,
        this.warehouse.id,
        reservation.quantity,
      ),
    );
  }

  confirmReservation(
    reservationId: string,
    actorId: string | null = null,
  ): InventoryTransactionEntity {
    const reservation = this.reservations.find((r) => r.id === reservationId);

    if (!reservation || !reservation.isActive) {
      throw new Error(
        `Reservation ${reservationId} not found or already released`,
      );
    }

    reservation.isActive = false;
    reservation.isDeleted = true;
    reservation.deletedAt = new Date();

    const transaction = this.recordTransaction(
      TransactionType.SALE,
      reservation.quantity,
      reservation.referenceId,
      reservation.referenceType,
      null,
      actorId,
    );

    return transaction;
  }

  receiveStock(
    quantity: number,
    referenceId: string | null = null,
    referenceType: string | null = null,
    notes: string | null = null,
    actorId: string | null = null,
  ): InventoryTransactionEntity {
    if (quantity <= 0) {
      throw new Error('Received quantity must be greater than zero');
    }

    const transaction = this.recordTransaction(
      TransactionType.PURCHASE_RECEIVED,
      quantity,
      referenceId,
      referenceType,
      notes,
      actorId,
    );

    this.addDomainEvent(
      new StockReceivedEvent(
        this.variantId,
        this.warehouse.id,
        quantity,
        transaction.id,
        referenceId,
      ),
    );

    return transaction;
  }

  adjust(
    quantity: number,
    type: TransactionType.ADJUSTMENT_IN | TransactionType.ADJUSTMENT_OUT,
    notes: string | null = null,
    actorId: string | null = null,
  ): InventoryTransactionEntity {
    if (quantity <= 0) {
      throw new Error('Adjustment quantity must be greater than zero');
    }

    if (type === TransactionType.ADJUSTMENT_OUT) {
      const { onHand } = this.getLevel();
      if (onHand < quantity) {
        throw new InsufficientStockException(
          this.variantId,
          this.warehouse.id,
          quantity,
          onHand,
        );
      }
    }

    const transaction = this.recordTransaction(
      type,
      quantity,
      null,
      null,
      notes,
      actorId,
    );

    this.addDomainEvent(
      new StockAdjustedEvent(
        this.variantId,
        this.warehouse.id,
        quantity,
        type,
        transaction.id,
      ),
    );

    return transaction;
  }

  recordWorkshopUsage(
    quantity: number,
    workOrderId: string,
    actorId: string | null = null,
  ): InventoryTransactionEntity {
    const { available } = this.getLevel();

    if (available < quantity) {
      throw new InsufficientStockException(
        this.variantId,
        this.warehouse.id,
        quantity,
        available,
      );
    }

    return this.recordTransaction(
      TransactionType.WORKSHOP_USAGE,
      quantity,
      workOrderId,
      'WORK_ORDER',
      null,
      actorId,
    );
  }

  // ─── Private helpers ──────────────────────────────────────

  private recordTransaction(
    type: TransactionType,
    quantity: number,
    referenceId: string | null,
    referenceType: string | null,
    notes: string | null,
    actorId: string | null,
  ): InventoryTransactionEntity {
    const tx = new InventoryTransactionEntity();
    tx.id = uuidv4();
    tx.variantId = this.variantId;
    tx.warehouse = this.warehouse;
    tx.type = type;
    tx.quantity = quantity;
    tx.referenceId = referenceId;
    tx.referenceType = referenceType;
    tx.notes = notes;
    tx.actorId = actorId;

    this.transactions.push(tx);
    return tx;
  }
}
