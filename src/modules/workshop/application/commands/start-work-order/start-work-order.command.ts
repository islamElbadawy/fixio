export class StartWorkOrderCommand {
  constructor(
    public readonly workOrderId: string,
    public readonly actorId: string,
  ) {}
}
