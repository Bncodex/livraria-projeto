import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload, REFRESH_TOKEN_COOKIE } from './strategies/jwt.strategy';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra um novo leitor, emite JWT e grava cookies HttpOnly (access + refresh)',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'E-mail já cadastrado.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessao = await this.authService.register(registerDto);
    this.authService.definirCookiesSessao(res, sessao.token, sessao.refreshToken);

    return {
      usuario: sessao.usuario,
      token: sessao.token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autentica o usuário, emite JWT e grava cookies HttpOnly (access + refresh)',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login efetuado com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciais inválidas.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessao = await this.authService.login(loginDto);
    this.authService.definirCookiesSessao(res, sessao.token, sessao.refreshToken);

    return {
      usuario: sessao.usuario,
      token: sessao.token,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renova a sessão usando o cookie HttpOnly refresh_token',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sessão renovada com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Refresh token ausente ou expirado.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    const sessao = await this.authService.refresh(refreshToken);
    this.authService.definirCookiesSessao(res, sessao.token, sessao.refreshToken);

    return {
      usuario: sessao.usuario,
      token: sessao.token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Encerra a sessão removendo os cookies HttpOnly' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Logout efetuado com sucesso.' })
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authService.limparCookiesSessao(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado (via Cookie HttpOnly ou Bearer)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Perfil retornado com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou expirado.' })
  me(@Req() req: AuthenticatedRequest) {
    return {
      id: req.user.sub,
      nome: req.user.nome,
      email: req.user.email,
      perfil: req.user.perfil,
    };
  }
}
