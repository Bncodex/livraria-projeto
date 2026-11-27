import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware de proteção:
 * 1. Injeta X-Request-Id para rastreabilidade de erros e logs.
 * 2. Adiciona cabeçalhos extras de segurança além do Helmet.
 * 3. Sanitiza chaves maliciosas de NoSQL Injection (chaves começando com "$" ou contendo ".").
 */
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    if (req.body && typeof req.body === 'object') {
      this.sanitizeObject(req.body as Record<string, unknown>);
    }

    if (req.query && typeof req.query === 'object') {
      this.sanitizeObject(req.query as Record<string, unknown>);
    }

    if (req.params && typeof req.params === 'object') {
      this.sanitizeObject(req.params as Record<string, unknown>);
    }

    next();
  }

  private sanitizeObject(obj: Record<string, unknown>): void {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        continue;
      }

      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.sanitizeObject(value as Record<string, unknown>);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object') {
            this.sanitizeObject(item as Record<string, unknown>);
          }
        }
      }
    }
  }
}
