// // import 'dotenv/config';
// import { MikroORM } from '@mikro-orm/postgresql';
// import { WarehouseEntity } from '../../modules/inventory/domain/entities/warehouse.entity';

// async function seedInventory() {
//   const orm = await MikroORM.init({
//     entities: ['dist/**/*.entity.js'],
//     entitiesTs: ['src/**/*.entity.ts'],
//     host: process.env.DB_HOST ?? 'localhost',
//     port: parseInt(process.env.DB_PORT ?? '5432', 10),
//     user: process.env.DB_USERNAME ?? 'postgres',
//     password: process.env.DB_PASSWORD ?? '',
//     dbName: process.env.DB_NAME ?? 'fixio_db',
//   });

//   const em = orm.em.fork();

//   console.log('🌱 Seeding inventory...\n');

//   const warehouses = [
//     { name: 'Main Warehouse',    location: 'Cairo — Industrial Zone A' },
//     { name: 'Branch Warehouse',  location: 'Alexandria — Port District' },
//     { name: 'Workshop Storage',  location: 'Cairo — Workshop Floor' },
//   ];

//   const created: WarehouseEntity[] = [];

//   for (const w of warehouses) {
//     const existing = await em.findOne(WarehouseEntity, { name: w.name });
//     if (existing) {
//       console.log(`⚠  Skipping warehouse: ${w.name}`);
//       created.push(existing);
//       continue;
//     }
//     const warehouse = em.create(WarehouseEntity, w);
//     em.persist(warehouse);
//     created.push(warehouse);
//     console.log(`✓ Warehouse: ${w.name}`);
//   }

//   await em.flush();
//   await orm.close();

//   console.log('\n✅ Inventory seed complete');
//   console.log(`   ${warehouses.length} warehouses`);
// }

// seedInventory().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });