import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/http/api-response.interceptor';
import { AllExceptionsFilter } from './common/http/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global middleware
  app.useGlobalInterceptors(new ResponseTransformInterceptor(new Reflector()));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // Swagger setup
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Product API')
      .setDescription('API documentation for the Product service')
      .setVersion('1.0')
      .addTag('products')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'bearer',
      )
      .build(),
  );
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
