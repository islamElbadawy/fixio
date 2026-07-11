import { CreateWorkOrderDto } from '../../dtos/work-order.dto';

export class CreateWorkOrderCommand {
  constructor(
    public readonly dto: CreateWorkOrderDto,
    public readonly actorId: string,
  ) {}
}
