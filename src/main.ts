import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Maxlife API Nation')
    .setDescription('API for Maxlife user application and admin panel')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${process.env.API_VERSION}/api-docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true
    },
    customCss: `.swagger-ui .topbar { display: none }`
  });

  await app.listen(5008);
}
bootstrap();
