import { UpdateVehicleDto } from '../../dtos/vehicle.dto';

export class UpdateVehicleCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateVehicleDto,
    public readonly actorId: string,
  ) {}
}
