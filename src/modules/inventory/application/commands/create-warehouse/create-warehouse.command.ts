import { CreateWarehouseDto } from '../../dtos/warehouse.dto';

export class CreateWarehouseCommand {
  constructor(
    public readonly dto: CreateWarehouseDto,
    public readonly actorId: string,
  ) {}
}
