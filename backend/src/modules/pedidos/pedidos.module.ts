import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Livro, LivroSchema } from '../livros/schemas/livro.schema';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido, PedidoSchema } from './schemas/pedido.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Livro.name, schema: LivroSchema },
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
