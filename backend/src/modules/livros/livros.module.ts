import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LivrosController } from './livros.controller';
import { LivrosService } from './livros.service';
import { Livro, LivroSchema } from './schemas/livro.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Livro.name, schema: LivroSchema }]),
  ],
  controllers: [LivrosController],
  providers: [LivrosService],
  exports: [LivrosService, MongooseModule],
})
export class LivrosModule {}
