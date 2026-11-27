import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { FavoritosService } from './favoritos.service';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@ApiTags('Favoritos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista os livros favoritos, quantidade e total do usuário autenticado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Favoritos retornados com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Sessão ausente ou inválida.' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.favoritosService.findAllByUsuario(req.user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adiciona um livro à lista de favoritos' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Livro adicionado aos favoritos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livro não encontrado.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Livro já está nos favoritos.' })
  create(@Req() req: AuthenticatedRequest, @Body() createFavoritoDto: CreateFavoritoDto) {
    return this.favoritosService.create(req.user.sub, createFavoritoDto);
  }

  @Patch(':livroId/toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterna um livro nos favoritos (adiciona se não existir, remove se já existir)' })
  @ApiParam({ name: 'livroId', description: 'ObjectId do livro no MongoDB' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estado de favorito alternado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ObjectId inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livro não encontrado.' })
  toggle(
    @Req() req: AuthenticatedRequest,
    @Param('livroId', ParseObjectIdPipe) livroId: string,
  ) {
    return this.favoritosService.toggle(req.user.sub, livroId);
  }

  @Delete(':livroId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um livro específico dos favoritos' })
  @ApiParam({ name: 'livroId', description: 'ObjectId do livro no MongoDB' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Livro removido dos favoritos.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Favorito não encontrado.' })
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('livroId', ParseObjectIdPipe) livroId: string,
  ) {
    return this.favoritosService.remove(req.user.sub, livroId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Limpa toda a lista de favoritos do usuário autenticado' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Lista de favoritos limpa com sucesso.' })
  clear(@Req() req: AuthenticatedRequest) {
    return this.favoritosService.clear(req.user.sub);
  }
}
