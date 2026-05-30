import { Migration } from '@mikro-orm/migrations';

export class Migration20260530071210 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "categories" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "name" varchar(100) not null,
      "description" text null,
      "slug" varchar(150) not null,
      "is_active" boolean not null default true,
      "parent_id" uuid null,
      primary key ("id")
    );`);

    this.addSql(`create index "idx_categories_slug" on "categories" ("slug");`);

    this.addSql(`alter table "categories" add constraint "categories_slug_unique" unique ("slug");`);

    this.addSql(`alter table "categories" add constraint "categories_parent_id_foreign" foreign key ("parent_id") references "categories" ("id") on delete set null;`);

    this.addSql(`create table "product_templates" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "name" varchar(150) not null,
      "description" text null,
      "brand" varchar(100) null,
      "slug" varchar(200) not null,
      "is_active" boolean not null default true,
      "category_id" uuid not null,
      primary key ("id")
    );`);

    this.addSql(`create index "idx_templates_slug" on "product_templates" ("slug");`);

    this.addSql(`alter table "product_templates" add constraint "product_templates_slug_unique" unique ("slug");`);

    this.addSql(`alter table "product_templates" add constraint "product_templates_category_id_foreign" foreign key ("category_id") references "categories" ("id");`);

    this.addSql(`create table "product_variants" (
      "id" uuid not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz null,
      "is_deleted" boolean not null default false,
      "deleted_at" timestamptz null,
      "sku" varchar(100) not null,
      "name" varchar(150) null,
      "purchase_price" numeric(10,2) not null,
      "selling_price" numeric(10,2) not null,
      "specs" jsonb null default '{}',
      "is_active" boolean not null default true,
      "unit" varchar(10) null,
      "template_id" uuid not null,
      primary key ("id")
    );`);

    this.addSql(`create index "idx_variants_sku" on "product_variants" ("sku");`);

    this.addSql(`alter table "product_variants" add constraint "product_variants_sku_unique" unique ("sku");`);

    this.addSql(`create index "product_variants_specs_gin_idx" on "product_variants" using gin ("specs");`);

    this.addSql(`alter table "product_variants" add constraint "product_variants_template_id_foreign" foreign key ("template_id") references "product_templates" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "product_variants" drop constraint "product_variants_template_id_foreign";`);
    this.addSql(`alter table "product_templates" drop constraint "product_templates_category_id_foreign";`);
    this.addSql(`alter table "categories" drop constraint "categories_parent_id_foreign";`);
    this.addSql(`drop table if exists "product_variants" cascade;`);
    this.addSql(`drop table if exists "product_templates" cascade;`);
    this.addSql(`drop table if exists "categories" cascade;`);
  }
}