import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateItemPedidoDto {
  @ApiProperty({ example: '6745a1b2c3d4e5f6a7b8c9d0', description: 'ObjectId do livro no MongoDB' })
  @IsMongoId({ message: 'livroId deve ser um ObjectId válido.' })
  livroId!: string;

  @ApiProperty({ example: 2, minimum: 1, description: 'Quantidade de exemplares' })
  @IsInt()
  @Min(1, { message: 'A quantidade mínima por item é 1.' })
  quantidade!: number;
}

export class CreateEnderecoEntregaDto {
  @ApiProperty({ example: '01001000', description: 'CEP com 8 dígitos numéricos' })
  @IsString()
  @Matches(/^\d{8}$/, { message: 'O CEP deve conter exatamente 8 dígitos numéricos.' })
  cep!: string;

  @ApiProperty({ example: 'Praça da Sé' })
  @IsString()
  @IsNotEmpty()
  endereco!: string;

  @ApiProperty({ example: '100' })
  @IsString()
  @IsNotEmpty()
  numero!: string;

  @ApiPropertyOptional({ example: 'Apto 42' })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ example: 'Sé' })
  @IsString()
  @IsNotEmpty()
  bairro!: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  cidade!: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Length(2, 2, { message: 'A UF deve ter exatamente 2 caracteres.' })
  uf!: string;
}

export class CreatePedidoDto {
  @ApiProperty({ type: [CreateItemPedidoDto], description: 'Itens da sacola' })
  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido precisa ter pelo menos 1 item.' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  itens!: CreateItemPedidoDto[];

  @ApiProperty({ type: CreateEnderecoEntregaDto, description: 'Endereço de entrega do pedido' })
  @ValidateNested()
  @Type(() => CreateEnderecoEntregaDto)
  enderecoEntrega!: CreateEnderecoEntregaDto;
}
