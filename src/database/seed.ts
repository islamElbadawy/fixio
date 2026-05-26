// import { MikroORM } from '@mikro-orm/core';
// import config from '../../mikro-orm.config';
// import { UserEntity } from '../modules/identity/domain/entities/user.entity';
// import { UserRole } from '../modules/identity/domain/entities/role.enum';
// import * as bcrypt from 'bcrypt';

// async function seed() {
//   const orm = await MikroORM.init(config);
//   const em = orm.em.fork();

//   const users = [
//     {
//       email: 'admin@fixio.com',
//       password: 'Admin@12345',
//       fullName: 'System Admin',
//       role: UserRole.ADMIN,
//     },
//     {
//       email: 'inventory@fixio.com',
//       password: 'Inventory@123',
//       fullName: 'Inventory Manager',
//       role: UserRole.INVENTORY_MANAGER,
//     },
//     {
//       email: 'sales@fixio.com',
//       password: 'Sales@12345',
//       fullName: 'Sales Employee',
//       role: UserRole.SALES_EMPLOYEE,
//     },
//     {
//       email: 'tech@fixio.com',
//       password: 'Tech@123456',
//       fullName: 'Workshop Technician',
//       role: UserRole.WORKSHOP_TECHNICIAN,
//     },
//     {
//       email: 'accountant@fixio.com',
//       password: 'Account@123',
//       fullName: 'Accountant',
//       role: UserRole.ACCOUNTANT,
//     },
//   ];

//   for (const u of users) {
//     const exists = await em.findOne(UserEntity, { email: u.email });
//     if (exists) {
//       console.log(`⚠  Skipping ${u.email} — already exists`);
//       continue;
//     }

//     const user = em.create(UserEntity, {
//       email: u.email,
//       passwordHash: await bcrypt.hash(u.password, 12),
//       fullName: u.fullName,
//       role: u.role,
//       isActive: false,
//       isDeleted: false,
//       createdAt: new Date(),
//     });

//     em.persist(user);
//     console.log(`✓ Created ${u.email} (${u.role})`);
//   }

//   await em.flush();
//   await orm.close();
//   console.log('\n✅ Seed complete');
// }

// seed().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
