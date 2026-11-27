import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config/swagger.config';

/**
 * Configura middlewares globais, CORS, validação de DTOs e Swagger.
 * Reutilizada tanto pelo bootstrap tradicional (main.ts) quanto pela Serverless Function (api/index.ts).
 */
export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const corsOrigins = configService
    .get<string>('CORS_ORIGIN', 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim());

  app.setGlobalPrefix(apiPrefix);
  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT', 3000));
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`API rodando em http://localhost:${port}/${apiPrefix}`);
  logger.log(`Documentação Swagger em http://localhost:${port}/api/docs`);
}

if (require.main === module) {
  bootstrap();
}
