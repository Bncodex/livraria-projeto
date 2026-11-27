import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../auth/schemas/usuario.schema';
import { Livro } from '../../livros/schemas/livro.schema';

export type PedidoDocument = HydratedDocument<Pedido>;

export enum StatusPedido {
  PENDENTE = 'pendente',
  CONFIRMADO = 'confirmado',
  ENVIADO = 'enviado',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado',
}

@Schema({ _id: false })
export class ItemPedido {
  @Prop({ type: Types.ObjectId, ref: Livro.name, required: true })
  livroId!: Types.ObjectId;

  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true, min: 0 })
  precoUnitario!: number;

  @Prop({ required: true, min: 1 })
  quantidade!: number;
}

export const ItemPedidoSchema = SchemaFactory.createForClass(ItemPedido);

@Schema({ _id: false })
export class EnderecoEntrega {
  @Prop({ required: true })
  cep!: string;

  @Prop({ required: true })
  endereco!: string;

  @Prop({ required: true })
  numero!: string;

  @Prop({ default: '' })
  complemento?: string;

  @Prop({ required: true })
  bairro!: string;

  @Prop({ required: true })
  cidade!: string;

  @Prop({ required: true })
  uf!: string;
}

export const EnderecoEntregaSchema = SchemaFactory.createForClass(EnderecoEntrega);

@Schema({
  collection: 'pedidos',
  timestamps: true,
  versionKey: false,
})
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true, index: true })
  usuarioId!: Types.ObjectId;

  @Prop({ type: [ItemPedidoSchema], required: true })
  itens!: ItemPedido[];

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({ type: EnderecoEntregaSchema, required: true })
  enderecoEntrega!: EnderecoEntrega;

  @Prop({ type: String, enum: StatusPedido, default: StatusPedido.CONFIRMADO, index: true })
  status!: StatusPedido;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
