import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: process.env.ENV_FILE_PATH ?? '.env' });

if (process.env.NODE_ENV === 'production' && (!process.env.DB_USERNAME || !process.env.DB_PASSWORD)) {
  throw new Error('DB credentials are required in production (DB_USERNAME/DB_PASSWORD)');
}

export default defineConfig({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME ?? 'fixio_db',

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  metadataProvider: TsMorphMetadataProvider,

  extensions: [Migrator],

  migrations: {
    path: 'src/database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
  },

  debug: process.env.NODE_ENV === 'development',
});
