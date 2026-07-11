import { CreateCustomerDto } from '../../dtos/customer.dto';

export class CreateCustomerCommand {
  constructor(
    public readonly dto: CreateCustomerDto,
    public readonly actorId: string,
  ) {}
}
