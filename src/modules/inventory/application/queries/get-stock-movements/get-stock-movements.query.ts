export class GetStockMovementsQuery {
  constructor(
    public readonly variantId: string,
    public readonly warehouseId?: string,
    public readonly limit?: number,
  ) {}
}
