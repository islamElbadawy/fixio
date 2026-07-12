import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkOrderLineType } from '../../domain/entities/work-order-line-type.enum';

export class CreateWorkOrderDto {
  @ApiProperty({ example: 'uuid-of-vehicle' })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({ example: 'uuid-of-customer' })
  @IsUUID()
  customerId!: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  mileageIn?: number;

  @ApiPropertyOptional({ example: 'Engine misfiring at low RPM' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Customer reports issue started last week' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddWorkOrderLineDto {
  @ApiProperty({ enum: WorkOrderLineType, example: WorkOrderLineType.PART })
  @IsEnum(WorkOrderLineType)
  type!: WorkOrderLineType;

  @ApiProperty({ example: 'Oil Filter Replacement' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unitPrice!: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({ example: 'uuid-of-variant' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-warehouse' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;
}

export class RecordPartConsumptionDto {
  @ApiProperty({ example: 'uuid-of-work-order-line' })
  @IsUUID()
  lineId!: string;
}

export class CompleteWorkOrderDto {
  @ApiPropertyOptional({ example: 47500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  mileageOut?: number;
}
