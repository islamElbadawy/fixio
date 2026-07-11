import { CreateSalesOrderDto } from '../../dtos/sales-order.dto';

export class CreateOrderCommand {
  constructor(
    public readonly dto: CreateSalesOrderDto,
    public readonly actorId: string,
  ) {}
}
