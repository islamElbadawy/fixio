import { UpdateCategoryDto } from '../../dtos/category.dto';

export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateCategoryDto,
  ) {}
}
