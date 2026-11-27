import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryLivroDto {
  @ApiPropertyOptional({ example: 'Fábula', description: 'Filtra livros por gênero' })
  @IsOptional()
  @IsString()
  genero?: string;

  @ApiPropertyOptional({ example: 'Príncipe', description: 'Busca por título ou autor' })
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}
