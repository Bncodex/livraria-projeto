import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosFacade } from '../../facades/favoritos.facade';
import { CarrinhoFacade } from '../../facades/carrinho.facade';
import { Livro } from '../../models/livro.model';

@Component({
  selector: 'app-favoritos-drawer',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './favoritos-drawer.html',
  styleUrl: './favoritos-drawer.css'
})
export class FavoritosDrawer {
  readonly favoritos = inject(FavoritosFacade);
  readonly carrinho = inject(CarrinhoFacade);

  fechar(): void {
    this.favoritos.fechar();
  }

  remover(livroId: number): void {
    this.favoritos.remover(livroId);
  }

  adicionarAoCarrinho(livro: Livro): void {
    this.carrinho.adicionar(livro);
    this.favoritos.mostrarAviso(`"${livro.titulo}" adicionado à sacola!`);
  }

  adicionarTodosAoCarrinho(): void {
    const itens = this.favoritos.itens();
    if (itens.length === 0) return;
    itens.forEach((livro) => this.carrinho.adicionar(livro));
    this.favoritos.mostrarAviso(`${itens.length} livro(s) adicionados à sacola!`);
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.favoritos.aberto()) {
      this.fechar();
    }
  }
}
