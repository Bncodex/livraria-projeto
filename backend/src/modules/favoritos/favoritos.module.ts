import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Livro, LivroSchema } from '../livros/schemas/livro.schema';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';
import { Favorito, FavoritoSchema } from './schemas/favorito.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorito.name, schema: FavoritoSchema },
      { name: Livro.name, schema: LivroSchema },
    ]),
  ],
  controllers: [FavoritosController],
  providers: [FavoritosService],
  exports: [FavoritosService],
})
export class FavoritosModule {}
