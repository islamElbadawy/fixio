import { RecordPaymentDto } from '../../dtos/invoice.dto';

export class RecordPaymentCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly dto: RecordPaymentDto,
    public readonly actorId: string,
  ) {}
}
