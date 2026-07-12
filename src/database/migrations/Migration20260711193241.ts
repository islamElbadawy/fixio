import { Migration } from '@mikro-orm/migrations';

export class Migration20260711193241 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`create table "vehicles" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "make" varchar(100) not null,
      "model" varchar(100) not null,
      "year" int not null,
      "license_plate" varchar(20) not null,
      "vin" varchar(17) null,
      "color" varchar(50) null,
      "mileage" int not null default 0,
      "is_active" boolean not null default true,
      "customer_id" uuid not null,
      primary key ("id")
    );`);

    this.addSql(
      `create index "idx_vehicles_plate" on "vehicles" ("license_plate");`,
    );
    this.addSql(
      `alter table "vehicles" add constraint "vehicles_license_plate_unique" unique ("license_plate");`,
    );
    this.addSql(
      `alter table "vehicles" add constraint "vehicles_vin_unique" unique ("vin");`,
    );

    this.addSql(`create table "work_orders" (
      "id" uuid not null,
      "work_order_number" varchar(50) not null,
      "vehicle_id" uuid not null,
      "customer_id" uuid not null,
      "technician_id" uuid null,
      "status" text not null default 'DRAFT',
      "diagnosis" text null,
      "notes" text null,
      "mileage_in" int null,
      "mileage_out" int null,
      "total_amount" numeric(10,2) not null default 0,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "started_at" timestamptz null,
      "completed_at" timestamptz null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      primary key ("id")
    );`);

    this.addSql(
      `create index "idx_work_orders_number" on "work_orders" ("work_order_number");`,
    );
    this.addSql(
      `alter table "work_orders" add constraint "work_orders_work_order_number_unique" unique ("work_order_number");`,
    );
    this.addSql(
      `alter table "work_orders" add constraint "work_orders_status_check" check ("status" in ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));`,
    );

    this.addSql(`create table "work_order_lines" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "type" text not null,
      "description" varchar(255) not null,
      "variant_id" uuid null,
      "warehouse_id" uuid null,
      "quantity" numeric(10,3) not null default 1,
      "unit_price" numeric(10,2) not null,
      "line_total" numeric(10,2) not null,
      "consumed" boolean not null default false,
      "work_order_id" uuid not null,
      primary key ("id")
    );`);

    this.addSql(
      `alter table "work_order_lines" add constraint "work_order_lines_type_check" check ("type" in ('SERVICE', 'PART'));`,
    );

    this.addSql(
      `alter table "vehicles" add constraint "vehicles_customer_id_foreign" foreign key ("customer_id") references "customers" ("id");`,
    );

    this.addSql(
      `alter table "work_orders" add constraint "work_orders_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicles" ("id");`,
    );
    this.addSql(
      `alter table "work_orders" add constraint "work_orders_customer_id_foreign" foreign key ("customer_id") references "customers" ("id");`,
    );

    this.addSql(
      `alter table "work_order_lines" add constraint "work_order_lines_work_order_id_foreign" foreign key ("work_order_id") references "work_orders" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "work_orders" drop constraint "work_orders_vehicle_id_foreign";`,
    );
    this.addSql(
      `alter table "work_order_lines" drop constraint "work_order_lines_work_order_id_foreign";`,
    );
    this.addSql(`drop table if exists "work_order_lines" cascade;`);
    this.addSql(`drop table if exists "work_orders" cascade;`);
    this.addSql(`drop table if exists "vehicles" cascade;`);
  }
}
