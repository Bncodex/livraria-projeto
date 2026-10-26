import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';
import { FavoritosFacade } from '../../../core/facades/favoritos.facade';
import { Livro } from '../../../core/models/livro.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, ContaConectada],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  readonly favoritos: FavoritosFacade;

  constructor() {
    try {
      this.favoritos = inject(FavoritosFacade);
    } catch {
      this.favoritos = {
        itens: () => [],
        quantidade: () => 0,
        total: () => 0,
        isFavorito: () => false,
        alternar: () => false,
        abrir: () => undefined,
        fechar: () => undefined,
      } as unknown as FavoritosFacade;
    }
  }

  readonly destaques: (Livro & { precoFormatado: string })[] = [
    { id: 13, titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', imagem: '/images/eueessemeucoracao.jpeg', genero: 'Romance', preco: 41.9, precoFormatado: 'R$ 41,90', sinopse: 'Leah recebe um transplante de coração e passa a lidar com memórias, mistérios e sentimentos que transformam sua vida.' },
    { id: 14, titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', imagem: '/images/harrypotter.jpeg', genero: 'Fantasia', preco: 49.9, precoFormatado: 'R$ 49,90', sinopse: 'No confronto final contra Voldemort, Harry, Rony e Hermione procuram as Horcruxes e descobrem o peso das Relíquias da Morte.' },
    { id: 15, titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', imagem: '/images/joaoeopedefeijao.jpeg', genero: 'Conto infantil', preco: 24.9, precoFormatado: 'R$ 24,90', sinopse: 'Um clássico conto de aventura em que João troca um bem precioso por feijões mágicos e encontra um mundo acima das nuvens.' },
    { id: 16, titulo: 'O Alienista', autor: 'Machado de Assis', imagem: '/images/oalienista.jpeg', genero: 'Literatura brasileira', preco: 26.9, precoFormatado: 'R$ 26,90', sinopse: 'Dr. Simão Bacamarte decide estudar a loucura em Itaguaí, levando a cidade a questionar quem realmente é são.' },
  ];

  alternarFavorito(livro: Livro, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.favoritos.alternar(livro);
  }
}
