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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLivroDto } from './dto/create-livro.dto';
import { QueryLivroDto } from './dto/query-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { LivrosService } from './livros.service';

@ApiTags('Livros')
@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastra um novo livro no catálogo' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Livro criado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou inválido.' })
  create(@Body() createLivroDto: CreateLivroDto) {
    return this.livrosService.create(createLivroDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista livros do catálogo com paginação e filtros' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista paginada de livros retornada com sucesso.' })
  findAll(@Query() query: QueryLivroDto) {
    return this.livrosService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca um livro específico pelo ObjectId' })
  @ApiParam({ name: 'id', description: 'ObjectId do livro no MongoDB' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Livro encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ObjectId inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livro não encontrado.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.livrosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza parcialmente os dados de um livro' })
  @ApiParam({ name: 'id', description: 'ObjectId do livro no MongoDB' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Livro atualizado com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ObjectId ou payload inválido.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livro não encontrado.' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLivroDto: UpdateLivroDto,
  ) {
    return this.livrosService.update(id, updateLivroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um livro do catálogo' })
  @ApiParam({ name: 'id', description: 'ObjectId do livro no MongoDB' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Livro removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ObjectId inválido.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT ausente ou inválido.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livro não encontrado.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.livrosService.remove(id);
  }
}
