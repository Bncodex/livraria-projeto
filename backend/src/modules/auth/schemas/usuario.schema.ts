import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

export enum PerfilUsuario {
  LEITOR = 'leitor',
  ADMIN = 'admin',
}

@Schema({
  collection: 'usuarios',
  timestamps: true,
  versionKey: false,
})
export class Usuario {
  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true, select: false })
  senhaHash!: string;

  @Prop({ type: String, enum: PerfilUsuario, default: PerfilUsuario.LEITOR })
  perfil!: PerfilUsuario;

  @Prop({ default: true })
  ativo!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
