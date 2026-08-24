import { ItemCarrinho } from './item-carrinho.model';

export interface Pedido {
  id: number;
  criadoEm: string;
  itens: ItemCarrinho[];
  total: number;
}
