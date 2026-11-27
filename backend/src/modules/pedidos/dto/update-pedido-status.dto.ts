import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusPedido } from '../schemas/pedido.schema';

export class UpdatePedidoStatusDto {
  @ApiProperty({
    enum: StatusPedido,
    example: StatusPedido.ENVIADO,
    description: 'Novo status do pedido',
  })
  @IsEnum(StatusPedido, {
    message: `Status inválido. Valores permitidos: ${Object.values(StatusPedido).join(', ')}`,
  })
  status!: StatusPedido;
}
