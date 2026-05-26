import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, dbConfig, jwtConfig } from './config/app.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SharedModule } from './modules/shared/shared.module';
import { IdentityModule } from './modules/identity/identity.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig],
      envFilePath: '.env',
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
    IdentityModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
