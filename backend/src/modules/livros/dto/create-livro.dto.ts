import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLivroDto {
  @ApiProperty({ example: 'O Pequeno Príncipe', description: 'Título do livro' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MaxLength(180)
  titulo!: string;

  @ApiProperty({ example: 'Antoine de Saint-Exupéry', description: 'Nome do autor' })
  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  @MaxLength(120)
  autor!: string;

  @ApiProperty({ example: 39.9, minimum: 0, description: 'Preço unitário em reais (BRL)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  preco!: number;

  @ApiProperty({ example: '/images/pequeno-principe.jpg', description: 'URL ou caminho da capa' })
  @IsString()
  @IsNotEmpty({ message: 'A imagem da capa é obrigatória.' })
  imagem!: string;

  @ApiProperty({
    example: 'Uma história poética sobre amizade, imaginação e o que é essencial na vida.',
    description: 'Sinopse do livro',
  })
  @IsString()
  @IsNotEmpty({ message: 'A sinopse é obrigatória.' })
  @MaxLength(2000)
  sinopse!: string;

  @ApiProperty({ example: 'Fábula', description: 'Gênero literário' })
  @IsString()
  @IsNotEmpty({ message: 'O gênero é obrigatório.' })
  @MaxLength(60)
  genero!: string;

  @ApiPropertyOptional({ example: 25, default: 10, description: 'Quantidade disponível em estoque' })
  @IsOptional()
  @IsInt()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({ example: true, default: true, description: 'Indica se o livro está visível no catálogo' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
