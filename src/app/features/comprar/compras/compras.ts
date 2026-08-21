import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { Livro } from '../../../core/models/livro.model';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CurrencyPipe, ContaConectada],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  readonly carrinho = inject(CarrinhoFacade);
  readonly livros: Livro[] = [
    { id: 1, titulo: 'A biblioteca da meia-noite', autor: 'Matt Haig', preco: 49.9, cor: 'midnight' },
    { id: 2, titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', preco: 42.9, cor: 'earth' },
    { id: 3, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', preco: 39.9, cor: 'rose' },
    { id: 4, titulo: 'O sol é para todos', autor: 'Harper Lee', preco: 45.9, cor: 'sunset' },
    { id: 5, titulo: 'O pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', preco: 15.9, cor: 'rose' },
  ];
  adicionar(livro: Livro) { this.carrinho.adicionar(livro); }
  remover(index: number) { this.carrinho.remover(index); }
}
