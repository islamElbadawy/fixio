export class GetStockLevelQuery {
  constructor(
    public readonly variantId: string,
    public readonly warehouseId: string,
  ) {}
}
