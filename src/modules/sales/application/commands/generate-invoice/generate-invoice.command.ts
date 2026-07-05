import { GenerateInvoiceDto } from '../../dtos/sales-order.dto';

export class GenerateInvoiceCommand {
  constructor(
    public readonly orderId: string,
    public readonly dto: GenerateInvoiceDto,
    public readonly actorId: string,
  ) {}
}
