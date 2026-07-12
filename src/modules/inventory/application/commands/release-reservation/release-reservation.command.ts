import { ReleaseReservationDto } from '../../dtos/stock.dto';

export class ReleaseReservationCommand {
  constructor(
    public readonly dto: ReleaseReservationDto,
    public readonly actorId: string,
  ) {}
}
