import { CreateProductVariantDto } from '../../dtos/product-variant.dto';

export class CreateProductVariantCommand {
  constructor(public readonly dto: CreateProductVariantDto) {}
}
