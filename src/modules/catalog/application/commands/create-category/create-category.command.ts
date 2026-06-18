import { CreateCategoryDto } from '../../dtos/category.dto';

export class CreateCategoryCommand {
  constructor(public readonly dto: CreateCategoryDto) {}
}
