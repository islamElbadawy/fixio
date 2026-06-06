export class GetVariantsBySpecsQuery {
  constructor(
    public readonly filters: Record<string, unknown>,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}
