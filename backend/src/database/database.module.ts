import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Módulo de conexão Mongoose estruturado para MongoDB Atlas.
 *
 * Observação: A URI real do MongoDB Atlas será injetada via variável de ambiente
 * `MONGODB_URI` no arquivo `.env` (ou nas variáveis do provedor Serverless).
 * As opções abaixo (maxPoolSize, serverSelectionTimeoutMS, socketTimeoutMS)
 * já estão otimizadas para ambiente Serverless.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const uri =
          configService.get<string>('MONGODB_URI') ||
          'mongodb://127.0.0.1:27017/universo_literario';
        const dbName = configService.get<string>('MONGODB_DB_NAME', 'universo_literario');

        return {
          uri,
          dbName,
          // Pool reduzido para não estourar o limite de conexões do MongoDB Atlas em Serverless
          maxPoolSize: 10,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          autoIndex: configService.get<string>('NODE_ENV') !== 'production',
          connectionFactory: (connection: Connection) => {
            connection.on('connected', () => {
              logger.log(`MongoDB conectado com sucesso (db: ${dbName}).`);
            });
            connection.on('error', (err: Error) => {
              logger.error(`Erro na conexão com MongoDB: ${err.message}`);
            });
            connection.on('disconnected', () => {
              logger.warn('Conexão com MongoDB encerrada.');
            });
            return connection;
          },
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
