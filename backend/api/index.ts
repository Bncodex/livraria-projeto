import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/main';

/**
 * Serverless Function Adapter (Node.js Runtime) para NestJS + Mongoose.
 *
 * Mantém a instância do Express/NestJS em cache entre execuções "warm"
 * para reduzir cold starts e reaproveitar o pool de conexões com o MongoDB Atlas.
 */
let cachedServer: Express | null = null;

async function getServer(): Promise<Express> {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );

  configureApp(nestApp);
  await nestApp.init();

  cachedServer = expressApp;
  return cachedServer;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const server = await getServer();
  server(req, res);
}
