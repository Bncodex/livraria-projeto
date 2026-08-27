import { Injectable, computed, inject, signal } from '@angular/core';
import { Livro } from '../models/livro.model';
import { ItemCarrinho } from '../models/item-carrinho.model';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class CarrinhoFacade {
  private readonly storage = inject(StorageService);
  private readonly chave = 'universo-literario.sacola';
  readonly itens = signal<ItemCarrinho[]>(this.carregarItens());
  readonly quantidade = computed(() => this.itens().reduce((total, item) => total + item.quantidade, 0));
  readonly total = computed(() => this.itens().reduce((soma, item) => soma + item.livro.preco * item.quantidade, 0));

  adicionar(livro: Livro): void {
    const itemExistente = this.itens().find((item) => item.livro.id === livro.id);
    this.atualizar(itemExistente
      ? this.itens().map((item) => item.livro.id === livro.id ? { ...item, quantidade: item.quantidade + 1 } : item)
      : [...this.itens(), { livro, quantidade: 1 }]);
  }
  diminuir(index: number): void {
    const item = this.itens()[index];
    if (!item) return;
    this.atualizar(item.quantidade === 1
      ? this.itens().filter((_, itemIndex) => itemIndex !== index)
      : this.itens().map((itemAtual, itemIndex) => itemIndex === index ? { ...itemAtual, quantidade: itemAtual.quantidade - 1 } : itemAtual));
  }
  remover(index: number): void { this.atualizar(this.itens().filter((_, itemIndex) => itemIndex !== index)); }
  limpar(): void { this.atualizar([]); }
  private carregarItens(): ItemCarrinho[] {
    const itens = this.storage.get<(Livro | ItemCarrinho)[]>(this.chave) ?? [];
    return itens.map((item) => 'livro' in item ? item : { livro: item, quantidade: 1 });
  }
  private atualizar(itens: ItemCarrinho[]): void { this.itens.set(itens); this.storage.set(this.chave, itens); }
}
