import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateLivroDto } from './dto/create-livro.dto';
import { QueryLivroDto } from './dto/query-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { Livro, LivroDocument } from './schemas/livro.schema';

@Injectable()
export class LivrosService {
  constructor(
    @InjectModel(Livro.name) private readonly livroModel: Model<LivroDocument>,
  ) {}

  async create(createLivroDto: CreateLivroDto): Promise<LivroDocument> {
    const novoLivro = new this.livroModel(createLivroDto);
    return novoLivro.save();
  }

  async findAll(query: QueryLivroDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<LivroDocument> = { ativo: true };

    if (query.genero) {
      filter.genero = new RegExp(`^${this.escapeRegex(query.genero)}$`, 'i');
    }

    if (query.busca) {
      const regex = new RegExp(this.escapeRegex(query.busca), 'i');
      filter.$or = [{ titulo: regex }, { autor: regex }, { genero: regex }];
    }

    const [items, total] = await Promise.all([
      this.livroModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.livroModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<LivroDocument> {
    const livro = await this.livroModel.findById(id).exec();
    if (!livro) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado.`);
    }
    return livro;
  }

  async update(id: string, updateLivroDto: UpdateLivroDto): Promise<LivroDocument> {
    const livroAtualizado = await this.livroModel
      .findByIdAndUpdate(id, updateLivroDto, { new: true, runValidators: true })
      .exec();

    if (!livroAtualizado) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado.`);
    }
    return livroAtualizado;
  }

  async remove(id: string): Promise<void> {
    const deletado = await this.livroModel.findByIdAndDelete(id).exec();
    if (!deletado) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado.`);
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
