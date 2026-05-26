import { MikroORM } from '@mikro-orm/core';
import config from '../../mikro-orm.config';

async function migrate() {
  const orm = await MikroORM.init(config);
  const migrator = orm.migrator;
  const pending = await migrator.getPending();

  if (pending.length === 0) {
    console.log('No pending migrations');
  } else {
    await migrator.up();
    console.log('✅ Migrations applied');
  }

  await orm.close();
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
