import { ReserveStockDto } from '../../dtos/stock.dto';

export class ReserveStockCommand {
  constructor(
    public readonly dto: ReserveStockDto,
    public readonly actorId: string,
  ) {}
}
