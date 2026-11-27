import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateFavoritoDto {
  @ApiProperty({
    example: '6745a1b2c3d4e5f6a7b8c9d0',
    description: 'ObjectId do livro a ser adicionado aos favoritos',
  })
  @IsMongoId({ message: 'livroId deve ser um ObjectId válido do MongoDB.' })
  livroId!: string;
}
