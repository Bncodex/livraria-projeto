import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';

const MONGO_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica o status da API e da conexão com o MongoDB' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'API operacional.',
  })
  check() {
    return {
      status: 'ok',
      runtime: 'nodejs',
      database: {
        provider: 'mongodb-mongoose',
        state: MONGO_STATES[this.mongoConnection.readyState] ?? 'unknown',
      },
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
