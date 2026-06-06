import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use((cookieParser as any)());
  app.enableShutdownHooks();

  const origin = config.get<string>('app.frontendOrigin') ?? process.env.FRONTEND_ORIGIN;
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.enableCors({ origin, credentials: true });
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
      }),
    );
  } else {
    app.enableCors({ origin: true, credentials: true });
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fixio API')
    .setDescription('Car Workshop & Spare Parts Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(config.get('app.port') ?? 5000);

  console.log(`\n🔧 Fixio API → http://localhost:${config.get('app.port') ?? 5000}/api\n`);
}
bootstrap();
