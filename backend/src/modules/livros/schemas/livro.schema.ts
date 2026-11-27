import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LivroDocument = HydratedDocument<Livro>;

@Schema({
  collection: 'livros',
  timestamps: true,
  versionKey: false,
})
export class Livro {
  @Prop({ required: true, trim: true, index: true })
  titulo!: string;

  @Prop({ required: true, trim: true, index: true })
  autor!: string;

  @Prop({ required: true, min: 0 })
  preco!: number;

  @Prop({ required: true, trim: true })
  imagem!: string;

  @Prop({ required: true, trim: true })
  sinopse!: string;

  @Prop({ required: true, trim: true, index: true })
  genero!: string;

  @Prop({ default: 10, min: 0 })
  estoque!: number;

  @Prop({ default: true })
  ativo!: boolean;
}

export const LivroSchema = SchemaFactory.createForClass(Livro);

// Índice textual para busca por título, autor ou gênero no MongoDB Atlas
LivroSchema.index({ titulo: 'text', autor: 'text', genero: 'text' });
