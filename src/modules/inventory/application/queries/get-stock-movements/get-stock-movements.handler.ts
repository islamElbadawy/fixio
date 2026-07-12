import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetStockMovementsQuery } from './get-stock-movements.query';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../../../domain/repositories/stock.repository.interface';
import { InventoryTransactionEntity } from '../../../domain/entities/inventory-transaction.entity';

@QueryHandler(GetStockMovementsQuery)
export class GetStockMovementsHandler implements IQueryHandler<GetStockMovementsQuery> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepo: IStockRepository,
  ) {}

  async execute(
    query: GetStockMovementsQuery,
  ): Promise<InventoryTransactionEntity[]> {
    return this.stockRepo.getTransactions(
      query.variantId,
      query.warehouseId,
      query.limit ?? 50,
    );
  }
}
