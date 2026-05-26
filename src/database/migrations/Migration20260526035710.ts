import { Migration } from '@mikro-orm/migrations';

export class Migration20260526035710 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "audit_logs" ("id" uuid not null, "actor_id" uuid null, "actor_role" varchar(50) null, "entity_type" varchar(100) not null, "entity_id" uuid null, "action" varchar(100) not null, "payload" jsonb null, "created_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`create index "audit_logs_actor_id_index" on "audit_logs" ("actor_id");`);
    this.addSql(`create index "audit_logs_entity_type_entity_id_index" on "audit_logs" ("entity_type", "entity_id");`);

    this.addSql(`create table "users" ("id" uuid not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "full_name" varchar(100) not null, "role" text not null default 'SALES_EMPLOYEE', "is_active" boolean not null default true, "refresh_token_hash" varchar(255) null, "is_deleted" boolean not null default false, "deleted_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz null, primary key ("id"));`);
    this.addSql(`create index "idx_users_email" on "users" ("email");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_role_check" check ("role" in ('ADMIN', 'INVENTORY_MANAGER', 'SALES_EMPLOYEE', 'WORKSHOP_TECHNICIAN', 'ACCOUNTANT'));`);
  }

}
