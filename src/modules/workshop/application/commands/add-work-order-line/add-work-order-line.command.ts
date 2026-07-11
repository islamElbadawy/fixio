import { AddWorkOrderLineDto } from '../../dtos/work-order.dto';

export class AddWorkOrderLineCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly dto: AddWorkOrderLineDto,
    public readonly actorId: string,
  ) {}
}
