import { Injectable, computed, inject, signal } from '@angular/core';
import { Livro } from '../models/livro.model';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class CarrinhoFacade {
  private readonly storage = inject(StorageService);
  private readonly chave = 'universo-literario.sacola';
  readonly itens = signal<Livro[]>(this.storage.get<Livro[]>(this.chave) ?? []);
  readonly quantidade = computed(() => this.itens().length);
  readonly total = computed(() => this.itens().reduce((soma, livro) => soma + livro.preco, 0));

  adicionar(livro: Livro): void { this.atualizar([...this.itens(), livro]); }
  remover(index: number): void { this.atualizar(this.itens().filter((_, itemIndex) => itemIndex !== index)); }
  limpar(): void { this.atualizar([]); }
  private atualizar(itens: Livro[]): void { this.itens.set(itens); this.storage.set(this.chave, itens); }
}
