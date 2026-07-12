export class CancelWorkOrderCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly actorId: string,
  ) {}
}
