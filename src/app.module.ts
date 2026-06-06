import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfig, dbConfig, jwtConfig } from './config/app.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SharedModule } from './modules/shared/shared.module';
import { IdentityModule } from './modules/identity/identity.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig],
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        JWT_ACCESS_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.when('NODE_ENV', { is: 'production', then: Joi.string().min(8).required(), otherwise: Joi.string().allow('') }),
        DB_NAME: Joi.string().default('fixio_db'),
        FRONTEND_ORIGIN: Joi.string().uri().required(),
      }),
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        driver: PostgreSqlDriver,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        user: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        dbName: config.get<string>('database.name'),
        metadataProvider: TsMorphMetadataProvider,
        autoLoadEntities: true,
        debug: config.get<string>('app.nodeEnv') === 'development',
      }),
    }),
    SharedModule,
    IdentityModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
