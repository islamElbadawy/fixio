// import 'dotenv/config';
// import { MikroORM } from '@mikro-orm/postgresql';
// import { CustomerEntity } from '../../modules/customers/domain/entities/customer.entity';

// async function seedCustomers() {
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

//   console.log('🌱 Seeding customers...\n');

//   const customers = [
//     {
//       name: 'Ahmed Hassan',
//       phone: '+201001234567',
//       email: 'ahmed@example.com',
//       address: '12 Tahrir St, Cairo',
//       creditLimit: 5000,
//     },
//     {
//       name: 'Mohamed Ali',
//       phone: '+201112345678',
//       email: 'mohamed@example.com',
//       address: '45 Nile Corniche, Giza',
//       creditLimit: 3000,
//     },
//     {
//       name: 'Sara Ibrahim',
//       phone: '+201223456789',
//       email: 'sara@example.com',
//       address: '78 Alexandria Desert Rd',
//       creditLimit: 8000,
//     },
//     {
//       name: 'Khaled Mahmoud',
//       phone: '+201334567890',
//       email: 'khaled@example.com',
//       address: '23 Port Said St, Cairo',
//       creditLimit: 2000,
//     },
//     {
//       name: 'Yasmin Nasser',
//       phone: '+201445678901',
//       email: 'yasmin@example.com',
//       address: '56 Heliopolis Ave, Cairo',
//       creditLimit: 10000,
//     },
//     {
//       name: 'Omar Farouk',
//       phone: '+201556789012',
//       email: null,
//       address: '90 Mansoura St, Delta',
//       creditLimit: 0,
//     },
//     {
//       name: 'Laila Samir',
//       phone: '+201667890123',
//       email: 'laila@example.com',
//       address: '34 Zamalek, Cairo',
//       creditLimit: 6000,
//     },
//     {
//       name: 'Tarek Wagdy',
//       phone: '+201778901234',
//       email: null,
//       address: '67 Nasr City, Cairo',
//       creditLimit: 0,
//     },
//   ];

//   for (const c of customers) {
//     const existing = await em.findOne(CustomerEntity, { phone: c.phone });
//     if (existing) {
//       console.log(`⚠  Skipping: ${c.name}`);
//       continue;
//     }
//     em.persist(em.create(CustomerEntity, c));
//     console.log(`✓ Customer: ${c.name}`);
//   }

//   await em.flush();
//   await orm.close();

//   console.log('\n✅ Customers seed complete');
// }

// seedCustomers().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
