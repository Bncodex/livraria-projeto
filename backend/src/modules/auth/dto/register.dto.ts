import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ana Leitora', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(120)
  nome!: string;

  @ApiProperty({ example: 'ana@universoliterario.com', description: 'E-mail único de acesso' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6, description: 'Senha de acesso (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  @MaxLength(72)
  senha!: string;
}
