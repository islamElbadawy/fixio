import { MikroORM } from '@mikro-orm/postgresql';
import { EntityData, ref, RequiredEntityData } from '@mikro-orm/core';
import { CategoryEntity } from '../../modules/catalog/domain/entities/category.entity';
import { ProductTemplateEntity } from '../../modules/catalog/domain/entities/product-template.entity';
import { ProductVariantEntity } from '../../modules/catalog/domain/entities/product-variant.entity';

async function seedCatalog() {
  const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USERNAME ?? 'openpg',
    password: process.env.DB_PASSWORD ?? 'openpgpwd',
    dbName: process.env.DB_NAME ?? 'fixio_db',
  });

  const em = orm.em.fork();

  console.log('🌱 Seeding catalog...\n');

  // ─── Categories ───────────────────────────────────────────

  const categoriesData: EntityData<CategoryEntity>[] = [
    {
      name: 'Engine Parts',
      slug: 'engine-parts',
      description: 'All engine-related components',
    },
    {
      name: 'Filters',
      slug: 'filters',
      description: 'Oil, air, fuel and cabin filters',
    },
    {
      name: 'Braking System',
      slug: 'braking-system',
      description: 'Brake pads, discs, calipers and fluid',
    },
    {
      name: 'Suspension',
      slug: 'suspension',
      description: 'Shock absorbers, springs and bushings',
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      description: 'Batteries, alternators and starters',
    },
    {
      name: 'Cooling System',
      slug: 'cooling-system',
      description: 'Radiators, thermostats and coolant hoses',
    },
    {
      name: 'Transmission',
      slug: 'transmission',
      description: 'Gearbox, clutch and drivetrain parts',
    },
    {
      name: 'Body & Exterior',
      slug: 'body-exterior',
      description: 'Mirrors, bumpers, lights and panels',
    },
    {
      name: 'Lubricants & Oils',
      slug: 'lubricants-oils',
      description: 'Engine oils, gear oils and greases',
    },
    {
      name: 'Belts & Chains',
      slug: 'belts-chains',
      description: 'Timing belts, drive belts and chains',
    },
  ];

  const categories: Record<string, CategoryEntity> = {};

  for (const data of categoriesData) {
    const existing = await em.findOne(CategoryEntity, {
      slug: data.slug as string,
    });
    if (existing) {
      console.log(`⚠  Skipping category: ${data.name}`);
      categories[data.slug as string] = existing;
      continue;
    }
    const cat = em.create(CategoryEntity, {
      ...data,
      isActive: true,
      createdAt: new Date(),
      isDeleted: false,
    } as RequiredEntityData<CategoryEntity>);
    em.persist(cat);
    categories[data.slug as string] = cat;
    console.log(`✓ Category: ${data.name}`);
  }

  await em.flush();

  // ─── Product Templates ────────────────────────────────────

  const templatesData: EntityData<ProductTemplateEntity>[] = [
    {
      name: 'Oil Filter',
      slug: 'oil-filter',
      brand: 'Bosch',
      category: ref(categories['filters']),
      description: 'High-performance oil filter',
    },
    {
      name: 'Air Filter',
      slug: 'air-filter',
      brand: 'Mann',
      category: ref(categories['filters']),
      description: 'Engine air intake filter',
    },
    {
      name: 'Fuel Filter',
      slug: 'fuel-filter',
      brand: 'Bosch',
      category: ref(categories['filters']),
      description: 'Fuel line filter',
    },
    {
      name: 'Cabin Air Filter',
      slug: 'cabin-air-filter',
      brand: 'Mann',
      category: ref(categories['filters']),
      description: 'Passenger cabin air filter',
    },
    {
      name: 'Spark Plug',
      slug: 'spark-plug',
      brand: 'NGK',
      category: ref(categories['engine-parts']),
      description: 'Iridium spark plug',
    },
    {
      name: 'Piston Ring Set',
      slug: 'piston-ring-set',
      brand: 'Mahle',
      category: ref(categories['engine-parts']),
      description: 'Complete piston ring set',
    },
    {
      name: 'Valve Cover Gasket',
      slug: 'valve-cover-gasket',
      brand: 'Elring',
      category: ref(categories['engine-parts']),
      description: 'Valve cover sealing gasket',
    },
    {
      name: 'Brake Pad Set',
      slug: 'brake-pad-set',
      brand: 'Brembo',
      category: ref(categories['braking-system']),
      description: 'Front or rear brake pads',
    },
    {
      name: 'Brake Disc',
      slug: 'brake-disc',
      brand: 'Brembo',
      category: ref(categories['braking-system']),
      description: 'Ventilated brake disc',
    },
    {
      name: 'Brake Caliper',
      slug: 'brake-caliper',
      brand: 'TRW',
      category: ref(categories['braking-system']),
      description: 'Brake caliper assembly',
    },
    {
      name: 'Shock Absorber',
      slug: 'shock-absorber',
      brand: 'Monroe',
      category: ref(categories['suspension']),
      description: 'Gas-charged shock absorber',
    },
    {
      name: 'Control Arm',
      slug: 'control-arm',
      brand: 'Lemforder',
      category: ref(categories['suspension']),
      description: 'Front lower control arm',
    },
    {
      name: 'Stabilizer Link',
      slug: 'stabilizer-link',
      brand: 'Moog',
      category: ref(categories['suspension']),
      description: 'Anti-roll bar drop link',
    },
    {
      name: 'Car Battery',
      slug: 'car-battery',
      brand: 'Varta',
      category: ref(categories['electrical']),
      description: 'Lead-acid starter battery',
    },
    {
      name: 'Alternator',
      slug: 'alternator',
      brand: 'Valeo',
      category: ref(categories['electrical']),
      description: 'Remanufactured alternator',
    },
    {
      name: 'Starter Motor',
      slug: 'starter-motor',
      brand: 'Bosch',
      category: ref(categories['electrical']),
      description: 'Remanufactured starter motor',
    },
    {
      name: 'Radiator',
      slug: 'radiator',
      brand: 'Nissens',
      category: ref(categories['cooling-system']),
      description: 'Aluminum coolant radiator',
    },
    {
      name: 'Thermostat',
      slug: 'thermostat',
      brand: 'Gates',
      category: ref(categories['cooling-system']),
      description: 'Engine thermostat with housing',
    },
    {
      name: 'Water Pump',
      slug: 'water-pump',
      brand: 'Gates',
      category: ref(categories['cooling-system']),
      description: 'Engine coolant water pump',
    },
    {
      name: 'Timing Belt Kit',
      slug: 'timing-belt-kit',
      brand: 'Gates',
      category: ref(categories['belts-chains']),
      description: 'Complete timing belt kit with tensioner',
    },
    {
      name: 'Serpentine Belt',
      slug: 'serpentine-belt',
      brand: 'Gates',
      category: ref(categories['belts-chains']),
      description: 'Accessory drive belt',
    },
    {
      name: 'Engine Oil 5W-30',
      slug: 'engine-oil-5w30',
      brand: 'Castrol',
      category: ref(categories['lubricants-oils']),
      description: 'Full synthetic engine oil 5W-30',
    },
    {
      name: 'Engine Oil 10W-40',
      slug: 'engine-oil-10w40',
      brand: 'Mobil',
      category: ref(categories['lubricants-oils']),
      description: 'Semi-synthetic engine oil 10W-40',
    },
  ];

  const templates: Record<string, ProductTemplateEntity> = {};

  for (const data of templatesData) {
    const existing = await em.findOne(ProductTemplateEntity, {
      slug: data.slug as string,
    });
    if (existing) {
      console.log(`⚠  Skipping template: ${data.name}`);
      templates[data.slug as string] = existing;
      continue;
    }
    const t = em.create(ProductTemplateEntity, {
      ...data,
      isActive: true,
      createdAt: new Date(),
      isDeleted: false,
    } as RequiredEntityData<ProductTemplateEntity>);
    em.persist(t);
    templates[data.slug as string] = t;
    console.log(`✓ Template: ${data.name}`);
  }

  await em.flush();

  // ─── Product Variants ─────────────────────────────────────

  const variantsData: EntityData<ProductVariantEntity>[] = [
    // Oil Filters
    {
      sku: 'OIL-FLT-001',
      template: ref(templates['oil-filter']),
      unit: 'piece',
      purchasePrice: 8.5,
      sellingPrice: 18.0,
      specs: {
        compatibility: 'Toyota Corolla',
        engine: '1.6L 1ZR-FE',
        year_from: '2008',
        year_to: '2019',
        thread: 'M20x1.5',
        height_mm: '65',
      },
    },
    {
      sku: 'OIL-FLT-002',
      template: ref(templates['oil-filter']),
      unit: 'piece',
      purchasePrice: 9.0,
      sellingPrice: 19.5,
      specs: {
        compatibility: 'Hyundai Elantra',
        engine: '1.8L G4NB',
        year_from: '2011',
        year_to: '2020',
        thread: 'M20x1.5',
        height_mm: '70',
      },
    },
    {
      sku: 'OIL-FLT-003',
      template: ref(templates['oil-filter']),
      unit: 'piece',
      purchasePrice: 10.0,
      sellingPrice: 21.0,
      specs: {
        compatibility: 'BMW 3 Series',
        engine: '2.0L B48',
        year_from: '2015',
        year_to: '2023',
        thread: 'M22x1.5',
        height_mm: '74',
      },
    },
    {
      sku: 'OIL-FLT-004',
      template: ref(templates['oil-filter']),
      unit: 'piece',
      purchasePrice: 7.5,
      sellingPrice: 16.0,
      specs: {
        compatibility: 'Kia Sportage',
        engine: '2.0L G4KD',
        year_from: '2010',
        year_to: '2016',
        thread: 'M20x1.5',
        height_mm: '65',
      },
    },

    // Air Filters
    {
      sku: 'AIR-FLT-001',
      template: ref(templates['air-filter']),
      unit: 'piece',
      purchasePrice: 12.0,
      sellingPrice: 25.0,
      specs: {
        compatibility: 'Toyota Corolla',
        engine: '1.6L 1ZR-FE',
        year_from: '2008',
        year_to: '2019',
        type: 'Panel',
      },
    },
    {
      sku: 'AIR-FLT-002',
      template: ref(templates['air-filter']),
      unit: 'piece',
      purchasePrice: 14.0,
      sellingPrice: 28.0,
      specs: {
        compatibility: 'Volkswagen Golf',
        engine: '1.4L TSI',
        year_from: '2012',
        year_to: '2020',
        type: 'Panel',
      },
    },
    {
      sku: 'AIR-FLT-003',
      template: ref(templates['air-filter']),
      unit: 'piece',
      purchasePrice: 18.0,
      sellingPrice: 35.0,
      specs: {
        compatibility: 'BMW 3 Series',
        engine: '2.0L B48',
        year_from: '2015',
        year_to: '2023',
        type: 'Panel',
      },
    },

    // Spark Plugs
    {
      sku: 'SPK-PLG-001',
      template: ref(templates['spark-plug']),
      unit: 'piece',
      purchasePrice: 6.0,
      sellingPrice: 13.0,
      specs: {
        compatibility: 'Toyota Corolla',
        engine: '1.6L 1ZR-FE',
        type: 'Iridium',
        gap_mm: '1.1',
        thread: 'M14x1.25',
      },
    },
    {
      sku: 'SPK-PLG-002',
      template: ref(templates['spark-plug']),
      unit: 'piece',
      purchasePrice: 8.0,
      sellingPrice: 17.0,
      specs: {
        compatibility: 'BMW 3 Series',
        engine: '2.0L B48',
        type: 'Iridium',
        gap_mm: '0.8',
        thread: 'M12x1.25',
      },
    },
    {
      sku: 'SPK-PLG-003',
      template: ref(templates['spark-plug']),
      unit: 'piece',
      purchasePrice: 5.5,
      sellingPrice: 12.0,
      specs: {
        compatibility: 'Hyundai Elantra',
        engine: '1.8L G4NB',
        type: 'Platinum',
        gap_mm: '1.0',
        thread: 'M14x1.25',
      },
    },

    // Brake Pads
    {
      sku: 'BRK-PAD-001',
      template: ref(templates['brake-pad-set']),
      unit: 'set',
      purchasePrice: 28.0,
      sellingPrice: 58.0,
      specs: {
        compatibility: 'Toyota Corolla',
        position: 'Front',
        year_from: '2008',
        year_to: '2019',
        material: 'Ceramic',
        thickness_mm: '15',
      },
    },
    {
      sku: 'BRK-PAD-002',
      template: ref(templates['brake-pad-set']),
      unit: 'set',
      purchasePrice: 22.0,
      sellingPrice: 45.0,
      specs: {
        compatibility: 'Toyota Corolla',
        position: 'Rear',
        year_from: '2008',
        year_to: '2019',
        material: 'Ceramic',
        thickness_mm: '12',
      },
    },
    {
      sku: 'BRK-PAD-003',
      template: ref(templates['brake-pad-set']),
      unit: 'set',
      purchasePrice: 45.0,
      sellingPrice: 95.0,
      specs: {
        compatibility: 'BMW 3 Series',
        position: 'Front',
        year_from: '2015',
        year_to: '2023',
        material: 'Ceramic',
        thickness_mm: '17',
      },
    },
    {
      sku: 'BRK-PAD-004',
      template: ref(templates['brake-pad-set']),
      unit: 'set',
      purchasePrice: 35.0,
      sellingPrice: 72.0,
      specs: {
        compatibility: 'Volkswagen Golf',
        position: 'Front',
        year_from: '2012',
        year_to: '2020',
        material: 'Semi-metallic',
        thickness_mm: '15',
      },
    },

    // Brake Discs
    {
      sku: 'BRK-DSC-001',
      template: ref(templates['brake-disc']),
      unit: 'piece',
      purchasePrice: 35.0,
      sellingPrice: 72.0,
      specs: {
        compatibility: 'Toyota Corolla',
        position: 'Front',
        diameter_mm: '255',
        year_from: '2008',
        year_to: '2019',
        ventilated: 'yes',
      },
    },
    {
      sku: 'BRK-DSC-002',
      template: ref(templates['brake-disc']),
      unit: 'piece',
      purchasePrice: 55.0,
      sellingPrice: 115.0,
      specs: {
        compatibility: 'BMW 3 Series',
        position: 'Front',
        diameter_mm: '330',
        year_from: '2015',
        year_to: '2023',
        ventilated: 'yes',
      },
    },

    // Shock Absorbers
    {
      sku: 'SHK-ABS-001',
      template: ref(templates['shock-absorber']),
      unit: 'piece',
      purchasePrice: 42.0,
      sellingPrice: 88.0,
      specs: {
        compatibility: 'Toyota Corolla',
        position: 'Front',
        year_from: '2008',
        year_to: '2019',
        type: 'Gas',
      },
    },
    {
      sku: 'SHK-ABS-002',
      template: ref(templates['shock-absorber']),
      unit: 'piece',
      purchasePrice: 38.0,
      sellingPrice: 78.0,
      specs: {
        compatibility: 'Toyota Corolla',
        position: 'Rear',
        year_from: '2008',
        year_to: '2019',
        type: 'Gas',
      },
    },
    {
      sku: 'SHK-ABS-003',
      template: ref(templates['shock-absorber']),
      unit: 'piece',
      purchasePrice: 65.0,
      sellingPrice: 135.0,
      specs: {
        compatibility: 'BMW 3 Series',
        position: 'Front',
        year_from: '2015',
        year_to: '2023',
        type: 'Gas',
      },
    },

    // Batteries
    {
      sku: 'BAT-001',
      template: ref(templates['car-battery']),
      unit: 'piece',
      purchasePrice: 55.0,
      sellingPrice: 110.0,
      specs: {
        capacity_ah: '60',
        cca: '540',
        voltage: '12',
        terminal: 'Standard',
        dimensions: '242x175x190',
      },
    },
    {
      sku: 'BAT-002',
      template: ref(templates['car-battery']),
      unit: 'piece',
      purchasePrice: 75.0,
      sellingPrice: 150.0,
      specs: {
        capacity_ah: '74',
        cca: '680',
        voltage: '12',
        terminal: 'Standard',
        dimensions: '278x175x190',
      },
    },
    {
      sku: 'BAT-003',
      template: ref(templates['car-battery']),
      unit: 'piece',
      purchasePrice: 95.0,
      sellingPrice: 185.0,
      specs: {
        capacity_ah: '95',
        cca: '850',
        voltage: '12',
        terminal: 'Standard',
        dimensions: '353x175x190',
      },
    },

    // Timing Belt Kits
    {
      sku: 'TMB-KIT-001',
      template: ref(templates['timing-belt-kit']),
      unit: 'set',
      purchasePrice: 55.0,
      sellingPrice: 115.0,
      specs: {
        compatibility: 'Toyota Corolla',
        engine: '1.6L 1ZR-FE',
        year_from: '2008',
        year_to: '2019',
        includes: 'belt,tensioner,idler',
      },
    },
    {
      sku: 'TMB-KIT-002',
      template: ref(templates['timing-belt-kit']),
      unit: 'set',
      purchasePrice: 85.0,
      sellingPrice: 175.0,
      specs: {
        compatibility: 'Volkswagen Golf',
        engine: '1.4L TSI',
        year_from: '2012',
        year_to: '2020',
        includes: 'belt,tensioner,water_pump',
      },
    },

    // Engine Oils
    {
      sku: 'OIL-5W30-1L',
      template: ref(templates['engine-oil-5w30']),
      unit: 'liter',
      purchasePrice: 6.0,
      sellingPrice: 12.0,
      specs: {
        viscosity: '5W-30',
        volume_l: '1',
        spec: 'ACEA C3',
        type: 'Full Synthetic',
      },
    },
    {
      sku: 'OIL-5W30-4L',
      template: ref(templates['engine-oil-5w30']),
      unit: 'liter',
      purchasePrice: 22.0,
      sellingPrice: 45.0,
      specs: {
        viscosity: '5W-30',
        volume_l: '4',
        spec: 'ACEA C3',
        type: 'Full Synthetic',
      },
    },
    {
      sku: 'OIL-10W40-4L',
      template: ref(templates['engine-oil-10w40']),
      unit: 'liter',
      purchasePrice: 16.0,
      sellingPrice: 32.0,
      specs: {
        viscosity: '10W-40',
        volume_l: '4',
        spec: 'ACEA A3/B4',
        type: 'Semi Synthetic',
      },
    },

    // Water Pumps
    {
      sku: 'WTR-PMP-001',
      template: ref(templates['water-pump']),
      unit: 'piece',
      purchasePrice: 32.0,
      sellingPrice: 68.0,
      specs: {
        compatibility: 'Toyota Corolla',
        engine: '1.6L 1ZR-FE',
        year_from: '2008',
        year_to: '2019',
      },
    },
    {
      sku: 'WTR-PMP-002',
      template: ref(templates['water-pump']),
      unit: 'piece',
      purchasePrice: 48.0,
      sellingPrice: 98.0,
      specs: {
        compatibility: 'BMW 3 Series',
        engine: '2.0L B48',
        year_from: '2015',
        year_to: '2023',
      },
    },

    // Thermostats
    {
      sku: 'THERM-001',
      template: ref(templates['thermostat']),
      unit: 'piece',
      purchasePrice: 14.0,
      sellingPrice: 29.0,
      specs: {
        compatibility: 'Toyota Corolla',
        opening_temp_c: '82',
        engine: '1.6L 1ZR-FE',
      },
    },
    {
      sku: 'THERM-002',
      template: ref(templates['thermostat']),
      unit: 'piece',
      purchasePrice: 22.0,
      sellingPrice: 45.0,
      specs: {
        compatibility: 'BMW 3 Series',
        opening_temp_c: '88',
        engine: '2.0L B48',
      },
    },
  ];

  console.log('\n🔩 Seeding variants...\n');

  for (const data of variantsData) {
    const existing = await em.findOne(ProductVariantEntity, {
      sku: data.sku as string,
    });
    if (existing) {
      console.log(`⚠  Skipping variant: ${data.sku}`);
      continue;
    }
    const v = em.create(ProductVariantEntity, {
      ...data,
      isActive: true,
      createdAt: new Date(),
      isDeleted: false,
    } as RequiredEntityData<ProductVariantEntity>);
    em.persist(v);
    console.log(`✓ Variant: ${data.sku}`);
  }

  await em.flush();
  await orm.close();

  console.log('\n✅ Catalog seed complete');
  console.log(`   ${categoriesData.length} categories`);
  console.log(`   ${templatesData.length} product templates`);
  console.log(`   ${variantsData.length} product variants`);
}

seedCatalog().catch((e) => {
  console.error(e);
  process.exit(1);
});
