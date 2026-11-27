import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'leitor@universoliterario.com', description: 'E-mail cadastrado' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha!: string;
}
