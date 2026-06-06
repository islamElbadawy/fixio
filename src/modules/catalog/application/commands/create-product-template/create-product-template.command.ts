import { CreateProductTemplateDto } from '../../dtos/product-template.dto';

export class CreateProductTemplateCommand {
  constructor(public readonly dto: CreateProductTemplateDto) {}
}