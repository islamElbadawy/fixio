import { UpdateProductVariantDto } from '../../dtos/product-variant.dto';

export class UpdateProductVariantCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateProductVariantDto,
  ) {}
}
