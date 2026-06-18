import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  MaxLength,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @ApiProperty({ example: 'OIL-FILTER-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiPropertyOptional({ example: 'Oil Filter — Toyota Corolla 2020' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchasePrice!: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice!: number;

  @ApiPropertyOptional({
    example: {
      compatibility: 'Toyota Corolla',
      year: '2020',
      diameter: '76mm',
    },
  })
  @IsOptional()
  @IsObject()
  specs?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'piece' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  unit?: string;

  @ApiProperty({ example: 'uuid-of-template' })
  @IsUUID()
  templateId!: string;
}

export class UpdateProductVariantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchasePrice?: number;

  @ApiPropertyOptional({ example: 25.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  specs?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}

export class FilterVariantBySpecsDto {
  @ApiProperty({
    example: { compatibility: 'Toyota Corolla', year: '2020' },
    description: 'Key-value pairs to match against variant specs',
  })
  @IsObject()
  filters!: Record<string, unknown>;
}
