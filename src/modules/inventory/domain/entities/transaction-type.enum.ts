export enum TransactionType {
  PURCHASE_RECEIVED   = 'PURCHASE_RECEIVED',
  SALE                = 'SALE',
  WORKSHOP_USAGE      = 'WORKSHOP_USAGE',
  ADJUSTMENT_IN       = 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT      = 'ADJUSTMENT_OUT',
  TRANSFER_IN         = 'TRANSFER_IN',
  TRANSFER_OUT        = 'TRANSFER_OUT',
}

export const INBOUND_TYPES = [
  TransactionType.PURCHASE_RECEIVED,
  TransactionType.ADJUSTMENT_IN,
  TransactionType.TRANSFER_IN,
];

export const OUTBOUND_TYPES = [
  TransactionType.SALE,
  TransactionType.WORKSHOP_USAGE,
  TransactionType.ADJUSTMENT_OUT,
  TransactionType.TRANSFER_OUT,
];