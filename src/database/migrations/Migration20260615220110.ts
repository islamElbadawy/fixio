import { Migration } from '@mikro-orm/migrations';

export class Migration20260615220110 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "stock_reservations" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "variant_id" uuid not null,
      "warehouse_id" uuid not null,
      "quantity" numeric(10,3) not null,
      "reference_id" uuid null,
      "reference_type" varchar(100) null,
      "expires_at" timestamptz null,
      "is_active" boolean not null default true,
      primary key ("id")
    );`);

    this.addSql(`create index "stock_reservations_variant_id_index" on "stock_reservations" ("variant_id");`);
    this.addSql(`create index "stock_reservations_variant_id_warehouse_id_index" on "stock_reservations" ("variant_id", "warehouse_id");`);

    this.addSql(`create table "inventory_transactions" (
      "id" uuid not null,
      "variant_id" uuid not null,
      "warehouse_id" uuid not null,
      "type" text not null,
      "quantity" numeric(10,3) not null,
      "reference_id" uuid null,
      "reference_type" varchar(100) null,
      "notes" text null,
      "actor_id" uuid null,
      "created_at" timestamptz not null,
      primary key ("id")
    );`);

    this.addSql(`create index "inventory_transactions_variant_id_index" on "inventory_transactions" ("variant_id");`);
    this.addSql(`create index "inventory_transactions_variant_id_type_index" on "inventory_transactions" ("variant_id", "type");`);
    this.addSql(`create index "inventory_transactions_variant_id_warehouse_id_index" on "inventory_transactions" ("variant_id", "warehouse_id");`);

    this.addSql(`alter table "stock_reservations" add constraint "stock_reservations_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouses" ("id");`);

    this.addSql(`alter table "inventory_transactions" add constraint "inventory_transactions_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouses" ("id");`);

    this.addSql(`alter table "inventory_transactions" add constraint "inventory_transactions_type_check" check ("type" in ('PURCHASE_RECEIVED', 'SALE', 'WORKSHOP_USAGE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'TRANSFER_IN', 'TRANSFER_OUT'));`);

    this.addSql(`drop index if exists "audit_logs_entity_type_entity_id_index";`);
    this.addSql(`create index if not exists "idx_audit_entity" on "audit_logs" ("entity_type", "entity_id");`);
    this.addSql(`alter index if exists "audit_logs_actor_id_index" rename to "idx_audit_actor";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "stock_reservations" cascade;`);
    this.addSql(`drop table if exists "inventory_transactions" cascade;`);

    this.addSql(`drop index if exists "idx_audit_entity";`);
    this.addSql(`create index "audit_logs_entity_type_entity_id_index" on "audit_logs" ("entity_type", "entity_id");`);
    this.addSql(`alter index if exists "idx_audit_actor" rename to "audit_logs_actor_id_index";`);
  }
}