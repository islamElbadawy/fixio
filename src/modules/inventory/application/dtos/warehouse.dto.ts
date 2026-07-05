import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: '123 Industrial Zone, Cairo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;
}

export class UpdateWarehouseDto {
  @ApiPropertyOptional({ example: 'Main Warehouse' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}
