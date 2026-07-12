import { CompleteWorkOrderDto } from '../../dtos/work-order.dto';

export class CompleteWorkOrderCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly dto: CompleteWorkOrderDto,
    public readonly actorId: string,
  ) {}
}
