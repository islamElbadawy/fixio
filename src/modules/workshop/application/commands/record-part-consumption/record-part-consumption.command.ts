import { RecordPartConsumptionDto } from '../../dtos/work-order.dto';

export class RecordPartConsumptionCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly dto: RecordPartConsumptionDto,
    public readonly actorId: string,
  ) {}
}
