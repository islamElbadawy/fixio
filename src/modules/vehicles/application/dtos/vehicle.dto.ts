import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  make!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model!: string;

  @ApiProperty({ example: 2020 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  year!: number;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate!: string;

  @ApiPropertyOptional({ example: '1HGBH41JXMN109186' })
  @IsOptional()
  @IsString()
  @Length(17, 17)
  vin?: string;

  @ApiPropertyOptional({ example: 'White' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  mileage?: number;

  @ApiProperty({ example: 'uuid-of-customer' })
  @IsUUID()
  customerId!: string;
}

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  make?: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ example: 'ABC-1234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(17, 17)
  vin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  mileage?: number;
}
