import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PerfilUsuario } from '../auth/schemas/usuario.schema';
import { Livro, LivroDocument } from '../livros/schemas/livro.schema';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';
import { ItemPedido, Pedido, PedidoDocument } from './schemas/pedido.schema';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private readonly pedidoModel: Model<PedidoDocument>,
    @InjectModel(Livro.name) private readonly livroModel: Model<LivroDocument>,
  ) {}

  async create(usuarioId: string, createPedidoDto: CreatePedidoDto): Promise<PedidoDocument> {
    const idsLivros = createPedidoDto.itens.map((item) => new Types.ObjectId(item.livroId));
    const livrosEncontrados = await this.livroModel
      .find({ _id: { $in: idsLivros }, ativo: true })
      .lean()
      .exec();

    const mapaLivros = new Map(livrosEncontrados.map((l) => [l._id.toString(), l]));

    const itensProcessados: ItemPedido[] = [];
    let total = 0;

    for (const item of createPedidoDto.itens) {
      const livro = mapaLivros.get(item.livroId);
      if (!livro) {
        throw new BadRequestException(
          `Livro com ID "${item.livroId}" não encontrado ou indisponível.`,
        );
      }
      if (livro.estoque < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para "${livro.titulo}" (disponível: ${livro.estoque}).`,
        );
      }

      itensProcessados.push({
        livroId: new Types.ObjectId(item.livroId),
        titulo: livro.titulo,
        precoUnitario: livro.preco,
        quantidade: item.quantidade,
      });

      total += livro.preco * item.quantidade;
    }

    const totalArredondado = Number(total.toFixed(2));

    const pedido = await this.pedidoModel.create({
      usuarioId: new Types.ObjectId(usuarioId),
      itens: itensProcessados,
      total: totalArredondado,
      enderecoEntrega: {
        ...createPedidoDto.enderecoEntrega,
        uf: createPedidoDto.enderecoEntrega.uf.toUpperCase(),
      },
    });

    return pedido;
  }

  async findAllByUsuario(usuarioId: string): Promise<PedidoDocument[]> {
    return this.pedidoModel
      .find({ usuarioId: new Types.ObjectId(usuarioId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, usuarioId: string, perfil: PerfilUsuario): Promise<PedidoDocument> {
    const pedido = await this.pedidoModel.findById(id).exec();
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID "${id}" não encontrado.`);
    }

    if (perfil !== PerfilUsuario.ADMIN && pedido.usuarioId.toString() !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para visualizar este pedido.');
    }

    return pedido;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdatePedidoStatusDto,
    usuarioId: string,
    perfil: PerfilUsuario,
  ): Promise<PedidoDocument> {
    const pedido = await this.findOne(id, usuarioId, perfil);
    pedido.status = updateStatusDto.status;
    return pedido.save();
  }

  async remove(id: string, usuarioId: string, perfil: PerfilUsuario): Promise<void> {
    const pedido = await this.findOne(id, usuarioId, perfil);
    await this.pedidoModel.findByIdAndDelete(pedido._id).exec();
  }
}
