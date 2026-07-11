// import 'dotenv/config';
// import { MikroORM } from '@mikro-orm/postgresql';
// import { VehicleEntity } from '../../modules/vehicles/domain/entities/vehicle.entity';
// import { CustomerEntity } from '../../modules/customers/domain/entities/customer.entity';

// async function seedWorkshop() {
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

//   console.log('🌱 Seeding vehicles...\n');

//   const customers = await em.find(CustomerEntity, { isDeleted: false });
//   if (customers.length === 0) {
//     console.log('⚠  No customers found — run seed:customers first');
//     await orm.close();
//     return;
//   }

//   const vehicles = [
//     {
//       make: 'Toyota',
//       model: 'Corolla',
//       year: 2019,
//       licensePlate: 'ABC-1234',
//       vin: '1NXBR32E97Z123456',
//       color: 'White',
//       mileage: 45000,
//       customer: customers[0],
//     },
//     {
//       make: 'Hyundai',
//       model: 'Elantra',
//       year: 2020,
//       licensePlate: 'DEF-5678',
//       vin: '5NPDH4AE0GH123456',
//       color: 'Silver',
//       mileage: 32000,
//       customer: customers[1],
//     },
//     {
//       make: 'BMW',
//       model: '3 Series',
//       year: 2021,
//       licensePlate: 'GHI-9012',
//       vin: 'WBA8E9G57JNU12345',
//       color: 'Black',
//       mileage: 18000,
//       customer: customers[2],
//     },
//     {
//       make: 'Kia',
//       model: 'Sportage',
//       year: 2018,
//       licensePlate: 'JKL-3456',
//       vin: 'KNDPB3A23J7123456',
//       color: 'Red',
//       mileage: 67000,
//       customer: customers[3],
//     },
//     {
//       make: 'Volkswagen',
//       model: 'Golf',
//       year: 2022,
//       licensePlate: 'MNO-7890',
//       vin: '3VWF17AT4FM123456',
//       color: 'Blue',
//       mileage: 12000,
//       customer: customers[4],
//     },
//     {
//       make: 'Toyota',
//       model: 'Camry',
//       year: 2017,
//       licensePlate: 'PQR-1234',
//       vin: null,
//       color: 'Grey',
//       mileage: 89000,
//       customer: customers[5],
//     },
//     {
//       make: 'Kia',
//       model: 'Cerato',
//       year: 2020,
//       licensePlate: 'STU-5678',
//       vin: null,
//       color: 'White',
//       mileage: 41000,
//       customer: customers[6],
//     },
//   ];

//   for (const v of vehicles) {
//     const existing = await em.findOne(VehicleEntity, {
//       licensePlate: v.licensePlate,
//     });
//     if (existing) {
//       console.log(`⚠  Skipping: ${v.make} ${v.model} (${v.licensePlate})`);
//       continue;
//     }
//     em.persist(em.create(VehicleEntity, v));
//     console.log(
//       `✓ Vehicle: ${v.year} ${v.make} ${v.model} — ${v.licensePlate}`,
//     );
//   }

//   await em.flush();
//   await orm.close();

//   console.log('\n✅ Workshop seed complete');
// }

// seedWorkshop().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
