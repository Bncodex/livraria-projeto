import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  readonly livros = [
    { id: 1, titulo: 'A biblioteca da meia-noite', autor: 'Matt Haig', preco: 49.9, cor: 'midnight' },
    { id: 2, titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', preco: 42.9, cor: 'earth' },
    { id: 3, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', preco: 39.9, cor: 'rose' },
    { id: 4, titulo: 'O sol é para todos', autor: 'Harper Lee', preco: 45.9, cor: 'sunset' },
    { id: 5, titulo: 'O pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', preco: 15.9, cor: 'rose' },
  ];
  readonly carrinho = signal<typeof this.livros>([]);
  readonly total = computed(() => this.carrinho().reduce((soma, livro) => soma + livro.preco, 0));
  adicionar(livro: (typeof this.livros)[number]) { this.carrinho.update((itens) => [...itens, livro]); }
  remover(index: number) { this.carrinho.update((itens) => itens.filter((_, i) => i !== index)); }
}
