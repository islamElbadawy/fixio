import { ReceiveStockDto } from '../../dtos/stock.dto';

export class ReceiveStockCommand {
  constructor(
    public readonly dto: ReceiveStockDto,
    public readonly actorId: string,
  ) {}
}
