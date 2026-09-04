import { Livro } from './livro.model';

export interface ItemCarrinho {
  livro: Livro;
  quantidade: number;
}
