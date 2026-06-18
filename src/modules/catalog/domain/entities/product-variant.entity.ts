import {
  Entity,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../../../shared/infrastructure/database/base.entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

@Entity({ tableName: 'product_variants' })
export class ProductVariant extends BaseEntity {
  @Index({ name: 'idx_variants_sku' })
  @Property({ type: 'string', length: 100, unique: true })
  sku!: string;

  @Property({ type: 'string', length: 150, nullable: true })
  name: string | null = null;

  @Property({ type: 'decimal', precision: 10, scale: 2, fieldName: 'purchase_price' })
  purchasePrice!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, fieldName: 'selling_price' })
  sellingPrice!: number;

  @Property({ type: 'jsonb', nullable: true, default: '{}' })
  specs: Record<string, unknown> = {};

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @Property({ type: 'string', length: 10, nullable: true })
  unit: string | null = null;

  @Exclude()
  @ManyToOne(() => ProductTemplate, { fieldName: 'template_id' })
  template!: Rel<ProductTemplate>;

  updatePrice(sellingPrice: number): void {
    if (sellingPrice <= this.purchasePrice) {
      throw new DomainException(
        `Selling price ${sellingPrice} must exceed purchase price ${this.purchasePrice}`,
      );
    }
    this.sellingPrice = sellingPrice;
  }

  updateSpecs(specs: Record<string, unknown>): void {
    this.specs = { ...this.specs, ...specs };
  }

  deactivate(): void {
    this.isActive = false;
    this.isDeleted = true;
    this.deletedAt = new Date();
  }
}

import { ProductTemplate } from './product-template.entity';