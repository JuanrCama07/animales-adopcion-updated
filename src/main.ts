import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API de Adopción de Animales')
    .setDescription(
      'Gestión de animales, usuarios, refugios, solicitudes de adopción y carga de imágenes.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`, 'Local')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Animales Adopción Docs',
    swaggerOptions: {
      docExpansion: 'list',
      operationsSorter: 'alpha',
      persistAuthorization: true,
      tagsSorter: 'alpha',
    },
  });

  await app.listen(port);
  logger.log(`Servidor en http://localhost:${port}/api`);
  logger.log(`Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();
