import { Migration } from '@mikro-orm/migrations';

export class Migration20260606120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "failed_login_attempts" integer not null default 0;`);
    this.addSql(`alter table "users" add column "locked_until" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column if exists "locked_until";`);
    this.addSql(`alter table "users" drop column if exists "failed_login_attempts";`);
  }

}
