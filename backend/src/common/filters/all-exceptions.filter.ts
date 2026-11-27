import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

interface MongoServerError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

export interface ErrorResponsePayload {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'Erro interno inesperado no servidor.';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, unknown>;
        message = (resObj.message as string | string[]) ?? exception.message;
        error = (resObj.error as string) ?? HttpStatus[statusCode] ?? 'HttpException';
      }
    } else if (exception instanceof MongooseError.ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      error = 'Unprocessable Entity';
      message = Object.values(exception.errors).map((err) => err.message);
    } else if (exception instanceof MongooseError.CastError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Bad Request';
      message = `Valor inválido para o campo "${exception.path}": "${String(exception.value)}".`;
    } else if (this.isMongoDuplicateKeyError(exception)) {
      statusCode = HttpStatus.CONFLICT;
      error = 'Conflict';
      const duplicatedFields = Object.keys(exception.keyValue ?? exception.keyPattern ?? {});
      message =
        duplicatedFields.length > 0
          ? `Já existe um registro com o mesmo valor para: ${duplicatedFields.join(', ')}.`
          : 'Registro duplicado no banco de dados.';
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Error [${request.method} ${request.url}]: ${exception.message}`,
        exception.stack,
      );
    }

    const payload: ErrorResponsePayload = {
      statusCode,
      error,
      message,
      path: request.originalUrl || request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] as string | undefined,
    };

    response.status(statusCode).json(payload);
  }

  private isMongoDuplicateKeyError(exception: unknown): exception is MongoServerError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as MongoServerError).code === 11000
    );
  }
}
