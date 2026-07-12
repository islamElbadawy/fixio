import { AddOrderLineDto } from '../../dtos/sales-order.dto';

export class AddOrderLineCommand {
  constructor(
    public readonly orderId: string,
    public readonly dto: AddOrderLineDto,
    public readonly actorId: string,
  ) {}
}
