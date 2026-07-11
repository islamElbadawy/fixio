import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export class InsufficientStockException extends DomainException {
  constructor(
    variantId: string,
    warehouseId: string,
    requested: number,
    available: number,
  ) {
    super(
      `Insufficient stock for variant ${variantId} in warehouse ${warehouseId}. ` +
        `Requested: ${requested}, Available: ${available}`,
    );
    this.name = 'InsufficientStockException';
  }
}
