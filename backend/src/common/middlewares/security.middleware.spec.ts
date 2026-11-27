import { NextFunction, Request, Response } from 'express';
import { SecurityMiddleware } from './security.middleware';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;

  beforeEach(() => {
    middleware = new SecurityMiddleware();
  });

  it('deve adicionar headers de segurança, X-Request-Id e sanitizar operadores NoSQL', () => {
    const req = {
      headers: {},
      body: {
        email: 'leitor@universoliterario.com',
        $gt: '',
        nested: {
          'campo.injetado': 'malicioso',
          ok: 'valor-valido',
        },
      },
      query: {
        $where: '1==1',
        busca: 'Príncipe',
      },
      params: {},
    } as unknown as Request;

    const headers: Record<string, string> = {};
    const res = {
      setHeader: jest.fn((key: string, value: string) => {
        headers[key] = value;
      }),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(headers['X-Request-Id']).toBeDefined();
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(req.body.$gt).toBeUndefined();
    expect(req.body.nested['campo.injetado']).toBeUndefined();
    expect(req.body.nested.ok).toBe('valor-valido');
    expect((req.query as Record<string, unknown>).$where).toBeUndefined();
    expect(req.query.busca).toBe('Príncipe');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
