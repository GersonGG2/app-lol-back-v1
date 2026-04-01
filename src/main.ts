import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtro global para formatear TODOS los errores con { data, message, status }
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Valida automaticamente todos los DTOs en cada endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Elimina campos que no estan en el DTO
      forbidNonWhitelisted: true, // Lanza error si mandan campos extra
      transform: true,       // Convierte tipos automaticamente
    }),
  );

  // Configuracion de Swagger (documentacion automatica de la API)
  const config = new DocumentBuilder()
    .setTitle('LOL Tournament API')
    .setDescription('API para gestionar torneos y jugadores de League of Legends')
    .setVersion('1.0')
    .addTag('Usuarios', 'Gestion de usuarios de la plataforma')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`App corriendo en: http://localhost:${port}`);
  console.log(`Swagger docs en:  http://localhost:${port}/api/docs`);
}
bootstrap();
