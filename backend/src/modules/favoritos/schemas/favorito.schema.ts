import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../auth/schemas/usuario.schema';
import { Livro } from '../../livros/schemas/livro.schema';

export type FavoritoDocument = HydratedDocument<Favorito>;

@Schema({
  collection: 'favoritos',
  timestamps: true,
  versionKey: false,
})
export class Favorito {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true, index: true })
  usuarioId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Livro.name, required: true, index: true })
  livroId!: Types.ObjectId;
}

export const FavoritoSchema = SchemaFactory.createForClass(Favorito);

// Garante no MongoDB Atlas que o mesmo usuário não favorite o mesmo livro duas vezes
FavoritoSchema.index({ usuarioId: 1, livroId: 1 }, { unique: true });
