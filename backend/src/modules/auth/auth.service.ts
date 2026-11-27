import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { CookieOptions, Response } from 'express';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import {
  ACCESS_TOKEN_COOKIE,
  JwtPayload,
  REFRESH_TOKEN_COOKIE,
} from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const emailNormalizado = registerDto.email.trim().toLowerCase();
    const existente = await this.usuarioModel.findOne({ email: emailNormalizado }).lean().exec();

    if (existente) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
    }

    const senhaHash = await bcrypt.hash(registerDto.senha, 10);
    const usuario = await this.usuarioModel.create({
      nome: registerDto.nome.trim(),
      email: emailNormalizado,
      senhaHash,
    });

    return this.gerarRespostaSessao(usuario);
  }

  async login(loginDto: LoginDto) {
    const emailNormalizado = loginDto.email.trim().toLowerCase();
    const usuario = await this.usuarioModel
      .findOne({ email: emailNormalizado, ativo: true })
      .select('+senhaHash')
      .exec();

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.gerarRespostaSessao(usuario);
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente.');
    }

    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'dev-refresh-secret-troque-em-producao';

      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });

      const usuario = await this.usuarioModel
        .findOne({ _id: payload.sub, ativo: true })
        .exec();

      if (!usuario) {
        throw new UnauthorizedException('Usuário não encontrado ou inativo.');
      }

      return this.gerarRespostaSessao(usuario);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }

  definirCookiesSessao(res: Response, accessToken: string, refreshToken: string): void {
    const baseOptions = this.getCookieBaseOptions();

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...baseOptions,
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
    });

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });
  }

  limparCookiesSessao(res: Response): void {
    const baseOptions = this.getCookieBaseOptions();
    res.clearCookie(ACCESS_TOKEN_COOKIE, baseOptions);
    res.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions);
  }

  private getCookieBaseOptions(): CookieOptions {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const forceSecure = this.configService.get<string>('COOKIE_SECURE') === 'true';

    return {
      httpOnly: true,
      secure: isProd || forceSecure,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    };
  }

  private gerarRespostaSessao(usuario: UsuarioDocument) {
    const payload: JwtPayload = {
      sub: usuario._id.toString(),
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'dev-refresh-secret-troque-em-producao';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });

    return {
      usuario: {
        id: usuario._id.toString(),
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      token: accessToken,
      refreshToken,
    };
  }
}
