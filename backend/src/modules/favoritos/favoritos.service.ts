import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Livro, LivroDocument } from '../livros/schemas/livro.schema';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { Favorito, FavoritoDocument } from './schemas/favorito.schema';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectModel(Favorito.name) private readonly favoritoModel: Model<FavoritoDocument>,
    @InjectModel(Livro.name) private readonly livroModel: Model<LivroDocument>,
  ) {}

  async create(usuarioId: string, dto: CreateFavoritoDto): Promise<FavoritoDocument> {
    const livro = await this.livroModel.findById(dto.livroId).lean().exec();
    if (!livro) {
      throw new NotFoundException(`Livro com ID "${dto.livroId}" não encontrado.`);
    }

    const existente = await this.favoritoModel
      .findOne({
        usuarioId: new Types.ObjectId(usuarioId),
        livroId: new Types.ObjectId(dto.livroId),
      })
      .lean()
      .exec();

    if (existente) {
      throw new ConflictException('Este livro já está na sua lista de favoritos.');
    }

    return this.favoritoModel.create({
      usuarioId: new Types.ObjectId(usuarioId),
      livroId: new Types.ObjectId(dto.livroId),
    });
  }

  async findAllByUsuario(usuarioId: string) {
    const favoritos = await this.favoritoModel
      .find({ usuarioId: new Types.ObjectId(usuarioId) })
      .populate('livroId')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const itens = favoritos
      .map((fav) => fav.livroId as unknown as (Livro & { _id: Types.ObjectId }) | null)
      .filter((livro): livro is Livro & { _id: Types.ObjectId } => Boolean(livro));

    const total = Number(
      itens.reduce((acc, livro) => acc + (livro.preco ?? 0), 0).toFixed(2),
    );

    return {
      itens,
      quantidade: itens.length,
      total,
    };
  }

  async toggle(usuarioId: string, livroId: string) {
    const filtro = {
      usuarioId: new Types.ObjectId(usuarioId),
      livroId: new Types.ObjectId(livroId),
    };

    const existente = await this.favoritoModel.findOne(filtro).exec();
    if (existente) {
      await this.favoritoModel.deleteOne({ _id: existente._id }).exec();
      return {
        favorito: false,
        livroId,
        mensagem: 'Livro removido dos favoritos.',
      };
    }

    const livro = await this.livroModel.findById(livroId).lean().exec();
    if (!livro) {
      throw new NotFoundException(`Livro com ID "${livroId}" não encontrado.`);
    }

    const criado = await this.favoritoModel.create(filtro);
    return {
      favorito: true,
      livroId,
      item: criado,
      mensagem: 'Livro adicionado aos favoritos.',
    };
  }

  async remove(usuarioId: string, livroId: string): Promise<void> {
    const removido = await this.favoritoModel
      .findOneAndDelete({
        usuarioId: new Types.ObjectId(usuarioId),
        livroId: new Types.ObjectId(livroId),
      })
      .exec();

    if (!removido) {
      throw new NotFoundException('Livro não encontrado na sua lista de favoritos.');
    }
  }

  async clear(usuarioId: string): Promise<void> {
    await this.favoritoModel
      .deleteMany({ usuarioId: new Types.ObjectId(usuarioId) })
      .exec();
  }
}
