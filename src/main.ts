import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from './modules/shared/infrastructure/filters/domain-exception.filter';
import { HttpExceptionFilter } from './modules/shared/infrastructure/filters/http-exception.filter';
import { ResponseInterceptor } from './modules/shared/infrastructure/interceptors/response.interceptor';

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

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );

  app.useGlobalFilters(new HttpExceptionFilter(), new DomainExceptionFilter());

  app.enableCors({
    origin: config.get<string>('app.frontendOrigin'),
    credentials: true,
  });
  app.enableShutdownHooks();

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
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.get('app.port') ?? 5000);

  console.log(
    `\n🔧 Fixio API → http://localhost:${config.get('app.port') ?? 5000}/api\n`,
  );
}
bootstrap();
