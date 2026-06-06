import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Index,
} from '@mikro-orm/decorators/legacy';
import { Collection, Rel } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { CategoryEntity } from './category.entity';
import { ProductVariant } from './product-variant.entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { ProductTemplateCreatedEvent } from '../events/product-template-created.event';
import { ProductVariantCreatedEvent } from '../events/product-variant-created.event';
import { ProductVariantUpdatedEvent } from '../events/product-variant-updated.event';
import { ProductVariantRemovedEvent } from '../events/product-variant-removed.event';
import { AggregateRootBase } from 'src/modules/shared/infrastructure/database/aggregate-root.base';

@Entity({ tableName: 'product_templates' })
export class ProductTemplate extends AggregateRootBase {
  @Property({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string', length: 150 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'string', length: 100, nullable: true })
  brand: string | null = null;

  @Index({ name: 'idx_templates_slug' })
  @Property({ type: 'string', length: 200, unique: true })
  slug!: string;

  @Property({ type: 'boolean', default: true, fieldName: 'is_active' })
  isActive: boolean = true;

  @Property({ default: false, fieldName: 'is_deleted' })
  isDeleted: boolean = false;

  @Property({ type: 'timestamptz', nullable: true, fieldName: 'deleted_at' })
  deletedAt: Date | null = null;

  @Property({
    type: 'timestamptz',
    fieldName: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;

  @ManyToOne(() => CategoryEntity, { fieldName: 'category_id' })
  category!: Rel<CategoryEntity>;

  @Exclude()
  @OneToMany(() => ProductVariant, (v) => v.template, { eager: false })
  variants = new Collection<ProductVariant>(this);

  // ─── Factory method ───────────────────────────────────────

  static create(
    name: string,
    slug: string,
    category: CategoryEntity,
    description?: string,
    brand?: string,
  ): ProductTemplate {
    const template = new ProductTemplate();
    template.name = name;
    template.slug = slug;
    template.category = category;
    template.description = description ?? null;
    template.brand = brand ?? null;

    template.addDomainEvent(
      new ProductTemplateCreatedEvent(template.id, name, category.id),
    );

    return template;
  }

  // ─── Variant management ───────────────────────────────────

  addVariant(
    sku: string,
    purchasePrice: number,
    sellingPrice: number,
    specs: Record<string, unknown> = {},
    name?: string,
    unit?: string,
  ): ProductVariant {
    if (!this.isActive) {
      throw new DomainException(
        `Cannot add variant to inactive template "${this.name}"`,
      );
    }

    if (sellingPrice <= purchasePrice) {
      throw new DomainException(
        `Selling price ${sellingPrice} must exceed purchase price ${purchasePrice}`,
      );
    }

    const variant = new ProductVariant();
    variant.id = uuidv4();
    variant.sku = sku;
    variant.purchasePrice = purchasePrice;
    variant.sellingPrice = sellingPrice;
    variant.specs = specs;
    variant.name = name ?? null;
    variant.unit = unit ?? null;
    variant.template = this;

    this.variants.add(variant);

    this.addDomainEvent(
      new ProductVariantCreatedEvent(
        this.id,
        variant.id,
        sku,
        purchasePrice,
        sellingPrice,
      ),
    );

    return variant;
  }

  updateVariant(
    variantId: string,
    changes: {
      name?: string | null;
      purchasePrice?: number;
      sellingPrice?: number;
      specs?: Record<string, unknown>;
      unit?: string | null;
      isActive?: boolean;
    },
  ): ProductVariant {
    const variant = this.variants.getItems().find((v) => v.id === variantId);

    if (!variant) {
      throw new DomainException(
        `Variant ${variantId} does not belong to template "${this.name}"`,
      );
    }

    if (changes.name !== undefined) variant.name = changes.name;
    if (changes.unit !== undefined) variant.unit = changes.unit;
    if (changes.isActive !== undefined) variant.isActive = changes.isActive;
    if (changes.specs !== undefined) variant.updateSpecs(changes.specs);

    if (changes.sellingPrice !== undefined) {
      const newPurchasePrice = changes.purchasePrice ?? variant.purchasePrice;
      if (changes.sellingPrice <= newPurchasePrice) {
        throw new DomainException(
          `Selling price ${changes.sellingPrice} must exceed purchase price ${newPurchasePrice}`,
        );
      }
      variant.sellingPrice = changes.sellingPrice;
    }

    if (changes.purchasePrice !== undefined) {
      variant.purchasePrice = changes.purchasePrice;
    }

    this.addDomainEvent(
      new ProductVariantUpdatedEvent(this.id, variantId, changes),
    );

    return variant;
  }

  removeVariant(variantId: string): void {
    const variant = this.variants.getItems().find((v) => v.id === variantId);

    if (!variant) {
      throw new DomainException(
        `Variant ${variantId} does not belong to template "${this.name}"`,
      );
    }

    variant.deactivate();

    this.addDomainEvent(
      new ProductVariantRemovedEvent(this.id, variantId, variant.sku),
    );
  }

  // ─── Template behavior ────────────────────────────────────

  updateDetails(changes: {
    name?: string;
    description?: string | null;
    brand?: string | null;
    slug?: string;
    isActive?: boolean;
    category?: CategoryEntity;
  }): void {
    if (changes.name) this.name = changes.name;
    if (changes.description !== undefined)
      this.description = changes.description;
    if (changes.brand !== undefined) this.brand = changes.brand;
    if (changes.slug) this.slug = changes.slug;
    if (changes.isActive !== undefined) this.isActive = changes.isActive;
    if (changes.category) this.category = changes.category;
  }

  remove(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.isActive = false;
  }
}
