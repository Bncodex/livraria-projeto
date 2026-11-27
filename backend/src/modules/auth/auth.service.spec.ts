import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PerfilUsuario, Usuario } from './schemas/usuario.schema';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './strategies/jwt.strategy';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuarioModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token-assinado'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const map: Record<string, string> = {
        NODE_ENV: 'test',
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return map[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(Usuario.name), useValue: mockUsuarioModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve registrar um novo usuário e retornar access e refresh tokens', async () => {
    mockUsuarioModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    mockUsuarioModel.create.mockResolvedValue({
      _id: { toString: () => '6745a1b2c3d4e5f6a7b8c9d1' },
      nome: 'Ana Leitora',
      email: 'ana@universoliterario.com',
      perfil: PerfilUsuario.LEITOR,
    });

    const result = await service.register({
      nome: 'Ana Leitora',
      email: 'ana@universoliterario.com',
      senha: 'senha123',
    });

    expect(result.token).toBe('jwt-token-assinado');
    expect(result.refreshToken).toBe('jwt-token-assinado');
    expect(result.usuario.email).toBe('ana@universoliterario.com');
  });

  it('deve lançar ConflictException (409) ao registrar e-mail duplicado', async () => {
    mockUsuarioModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ _id: 'existente' }),
    });

    await expect(
      service.register({
        nome: 'Ana',
        email: 'ana@universoliterario.com',
        senha: 'senha123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('deve autenticar usuário válido com bcrypt e retornar token', async () => {
    const senhaHash = await bcrypt.hash('senha123', 4);
    mockUsuarioModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: { toString: () => '6745a1b2c3d4e5f6a7b8c9d1' },
        nome: 'Ana Leitora',
        email: 'ana@universoliterario.com',
        perfil: PerfilUsuario.LEITOR,
        senhaHash,
      }),
    });

    const result = await service.login({
      email: 'ana@universoliterario.com',
      senha: 'senha123',
    });

    expect(result.token).toBe('jwt-token-assinado');
  });

  it('deve lançar UnauthorizedException (401) para senha incorreta', async () => {
    const senhaHash = await bcrypt.hash('senha-correta', 4);
    mockUsuarioModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: { toString: () => '6745a1b2c3d4e5f6a7b8c9d1' },
        email: 'ana@universoliterario.com',
        senhaHash,
      }),
    });

    await expect(
      service.login({
        email: 'ana@universoliterario.com',
        senha: 'senha-errada',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve gravar cookies HttpOnly de access_token e refresh_token', () => {
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;

    service.definirCookiesSessao(res, 'access-jwt', 'refresh-jwt');

    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'access-jwt',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      'refresh-jwt',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );

    service.limparCookiesSessao(res);
    expect(res.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('deve renovar sessão com refresh_token válido e rejeitar quando ausente', async () => {
    await expect(service.refresh(undefined)).rejects.toThrow(UnauthorizedException);

    mockJwtService.verify.mockReturnValue({
      sub: '6745a1b2c3d4e5f6a7b8c9d1',
      email: 'ana@universoliterario.com',
      nome: 'Ana Leitora',
      perfil: PerfilUsuario.LEITOR,
    });

    mockUsuarioModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: { toString: () => '6745a1b2c3d4e5f6a7b8c9d1' },
        nome: 'Ana Leitora',
        email: 'ana@universoliterario.com',
        perfil: PerfilUsuario.LEITOR,
      }),
    });

    const renovado = await service.refresh('valid-refresh-token');
    expect(renovado.token).toBe('jwt-token-assinado');
  });
});
