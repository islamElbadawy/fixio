import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { ProductVariantCreatedEvent } from '../../../catalog/domain/events/product-variant-created.event';
import { GetWarehousesQuery } from '../../application/queries/get-warehouses/get-warehouses.query';
import { ReceiveStockCommand } from '../../application/commands/receive-stock/receive-stock.command';

@Injectable()
export class ProductVariantCreatedListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('catalog.product_variant_created')
  async handle(event: ProductVariantCreatedEvent): Promise<void> {
    // When a new variant is created, we don't add stock automatically.
    // Stock is added explicitly via the receive-stock endpoint.
    // This listener exists as a hook for future automation if needed.
    console.log(
      `[Inventory] New variant registered: ${event.sku} (${event.variantId})`,
    );
  }
}
