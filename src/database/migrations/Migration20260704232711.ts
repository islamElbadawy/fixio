import { Migration } from '@mikro-orm/migrations';

export class Migration20260704232711 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "customers" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "name" varchar(150) not null, "phone" varchar(20) not null, "email" varchar(255) null, "address" text null, "credit_limit" numeric(10,2) not null default 0, "credit_used" numeric(10,2) not null default 0, "is_active" boolean not null default true, primary key ("id"));`);
    this.addSql(`create index "idx_customers_phone" on "customers" ("phone");`);
    this.addSql(`alter table "customers" add constraint "customers_phone_unique" unique ("phone");`);
    this.addSql(`alter table "customers" add constraint "customers_email_unique" unique ("email");`);

    this.addSql(`create table "sales_orders" ("id" uuid not null, "order_number" varchar(50) not null, "customer_id" uuid not null, "status" text not null default 'DRAFT', "notes" text null, "total_amount" numeric(10,2) not null default 0, "work_order_id" uuid null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz null, primary key ("id"));`);
    this.addSql(`create index "idx_orders_number" on "sales_orders" ("order_number");`);
    this.addSql(`alter table "sales_orders" add constraint "sales_orders_order_number_unique" unique ("order_number");`);

    this.addSql(`create table "sales_order_lines" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "variant_id" uuid not null, "warehouse_id" uuid not null, "quantity" numeric(10,3) not null, "unit_price" numeric(10,2) not null, "line_total" numeric(10,2) not null, "reservation_id" uuid null, "order_id" uuid not null, primary key ("id"));`);

    this.addSql(`create table "invoices" ("id" uuid not null, "invoice_number" varchar(50) not null, "customer_id" uuid not null, "order_id" uuid not null, "status" text not null default 'UNPAID', "total_amount" numeric(10,2) not null, "paid_amount" numeric(10,2) not null default 0, "remaining_amount" numeric(10,2) not null default 0, "due_date" timestamptz null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz null, primary key ("id"));`);
    this.addSql(`create index "idx_invoices_number" on "invoices" ("invoice_number");`);
    this.addSql(`alter table "invoices" add constraint "invoices_invoice_number_unique" unique ("invoice_number");`);

    this.addSql(`create table "payments" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "amount" numeric(10,2) not null, "method" text not null, "notes" text null, "actor_id" uuid null, "invoice_id" uuid not null, primary key ("id"));`);

    this.addSql(`alter table "sales_orders" add constraint "sales_orders_customer_id_foreign" foreign key ("customer_id") references "customers" ("id");`);
    this.addSql(`alter table "sales_orders" add constraint "sales_orders_status_check" check ("status" in ('DRAFT', 'CONFIRMED', 'INVOICED', 'CANCELLED'));`);

    this.addSql(`alter table "sales_order_lines" add constraint "sales_order_lines_order_id_foreign" foreign key ("order_id") references "sales_orders" ("id");`);

    this.addSql(`alter table "invoices" add constraint "invoices_customer_id_foreign" foreign key ("customer_id") references "customers" ("id");`);
    this.addSql(`alter table "invoices" add constraint "invoices_order_id_foreign" foreign key ("order_id") references "sales_orders" ("id");`);
    this.addSql(`alter table "invoices" add constraint "invoices_status_check" check ("status" in ('UNPAID', 'PARTIAL', 'PAID', 'CANCELLED'));`);

    this.addSql(`alter table "payments" add constraint "payments_invoice_id_foreign" foreign key ("invoice_id") references "invoices" ("id");`);
    this.addSql(`alter table "payments" add constraint "payments_method_check" check ("method" in ('CASH', 'CARD', 'BANK_TRANSFER', 'CHEQUE'));`);

  }

  override down(): void | Promise<void> {
  this.addSql(`alter table "sales_orders" drop constraint "sales_orders_customer_id_foreign";`);
  this.addSql(`alter table "invoices" drop constraint "invoices_customer_id_foreign";`);
  this.addSql(`alter table "sales_order_lines" drop constraint "sales_order_lines_order_id_foreign";`);
  this.addSql(`alter table "invoices" drop constraint "invoices_order_id_foreign";`);
  this.addSql(`alter table "payments" drop constraint "payments_invoice_id_foreign";`);

  this.addSql(`drop table if exists "customers" cascade;`);
  this.addSql(`drop table if exists "sales_orders" cascade;`);
  this.addSql(`drop table if exists "sales_order_lines" cascade;`);
  this.addSql(`drop table if exists "invoices" cascade;`);
  this.addSql(`drop table if exists "payments" cascade;`);
}

}
