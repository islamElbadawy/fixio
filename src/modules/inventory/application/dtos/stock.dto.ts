import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionType } from '../../domain/entities/transaction-type.enum';

export class ReceiveStockDto {
  @ApiProperty({ example: 'uuid-of-variant' })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 'uuid-of-warehouse' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity!: number;

  @ApiPropertyOptional({ example: 'uuid-of-purchase-order' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @ApiPropertyOptional({ example: 'PURCHASE_ORDER' })
  @IsOptional()
  @IsString()
  referenceType?: string;

  @ApiPropertyOptional({ example: 'First batch received' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AdjustStockDto {
  @ApiProperty({ example: 'uuid-of-variant' })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 'uuid-of-warehouse' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({
    enum: [
      TransactionType.ADJUSTMENT_IN,
      TransactionType.ADJUSTMENT_OUT,
      TransactionType.WORKSHOP_USAGE,
    ],
  })
  @IsEnum([
    TransactionType.ADJUSTMENT_IN,
    TransactionType.ADJUSTMENT_OUT,
    TransactionType.WORKSHOP_USAGE,
  ])
  type!:
    | TransactionType.ADJUSTMENT_IN
    | TransactionType.ADJUSTMENT_OUT
    | TransactionType.WORKSHOP_USAGE;

  @ApiPropertyOptional({ example: 'Damaged items removed' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReserveStockDto {
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

  @ApiPropertyOptional({ example: 'uuid-of-sales-order' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @ApiPropertyOptional({ example: 'SALES_ORDER' })
  @IsOptional()
  @IsString()
  referenceType?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class ReleaseReservationDto {
  @ApiProperty({ example: 'uuid-of-reservation' })
  @IsUUID()
  reservationId!: string;
}

export class ConfirmReservationDto {
  @ApiProperty({ example: 'uuid-of-reservation' })
  @IsUUID()
  reservationId!: string;
}

export class GetStockLevelDto {
  @ApiProperty({ example: 'uuid-of-variant' })
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: 'uuid-of-warehouse' })
  @IsUUID()
  warehouseId!: string;
}
