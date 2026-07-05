import { AdjustStockDto } from '../../dtos/stock.dto';

export class AdjustStockCommand {
  constructor(
    public readonly dto: AdjustStockDto,
    public readonly actorId: string,
  ) {}
}
