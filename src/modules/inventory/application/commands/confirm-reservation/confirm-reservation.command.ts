import { ConfirmReservationDto } from '../../dtos/stock.dto';

export class ConfirmReservationCommand {
  constructor(
    public readonly dto: ConfirmReservationDto,
    public readonly actorId: string,
  ) {}
}
