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
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';
import { PedidosService } from './pedidos.service';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@ApiTags('Pedidos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo pedido a partir dos livros selecionados' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pedido confirmado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Itens inválidos ou sem estoque.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou inválido.' })
  create(@Req() req: AuthenticatedRequest, @Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(req.user.sub, createPedidoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista todos os pedidos do usuário autenticado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedidos retornados com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou inválido.' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.pedidosService.findAllByUsuario(req.user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna os detalhes de um pedido específico' })
  @ApiParam({ name: 'id', description: 'ObjectId do pedido no MongoDB' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pedido encontrado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado ao pedido de outro usuário.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() req: AuthenticatedRequest) {
    return this.pedidosService.findOne(id, req.user.sub, req.user.perfil);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza o status de um pedido' })
  @ApiParam({ name: 'id', description: 'ObjectId do pedido no MongoDB' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status atualizado com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para alterar este pedido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateStatusDto: UpdatePedidoStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.pedidosService.updateStatus(id, updateStatusDto, req.user.sub, req.user.perfil);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um pedido' })
  @ApiParam({ name: 'id', description: 'ObjectId do pedido no MongoDB' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Pedido removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para remover este pedido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pedido não encontrado.' })
  remove(@Param('id', ParseObjectIdPipe) id: string, @Req() req: AuthenticatedRequest) {
    return this.pedidosService.remove(id, req.user.sub, req.user.perfil);
  }
}
