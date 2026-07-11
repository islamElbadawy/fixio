import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderLineDto {
  @ApiProperty({ example: 'uuid-of-variant' })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 'uuid-of-warehouse' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unitPrice!: number;
}

export class CreateSalesOrderDto {
  @ApiProperty({ example: 'uuid-of-customer' })
  @IsUUID()
  customerId!: string;

  @ApiPropertyOptional({ example: 'Customer requested urgent delivery' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'uuid-of-work-order' })
  @IsOptional()
  @IsUUID()
  workOrderId?: string;

  @ApiPropertyOptional({
    type: [OrderLineDto],
    description: 'Optional — lines can be added after creation',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderLineDto)
  lines?: OrderLineDto[];
}

export class AddOrderLineDto {
  @ApiProperty({ example: 'uuid-of-variant' })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 'uuid-of-warehouse' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unitPrice!: number;
}

export class GenerateInvoiceDto {
  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsString()
  dueDate?: string;
}
