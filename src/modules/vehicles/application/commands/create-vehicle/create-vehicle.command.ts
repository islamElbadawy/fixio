import { CreateVehicleDto } from '../../dtos/vehicle.dto';

export class CreateVehicleCommand {
  constructor(
    public readonly dto: CreateVehicleDto,
    public readonly actorId: string,
  ) {}
}
