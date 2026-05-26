import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USERNAME ?? 'openpg',
  password: process.env.DB_PASSWORD ?? 'openpgpwd',
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
