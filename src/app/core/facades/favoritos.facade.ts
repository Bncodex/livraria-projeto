import { Injectable, computed, inject, signal } from '@angular/core';
import { Livro } from '../models/livro.model';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class FavoritosFacade {
  private readonly storage = inject(StorageService);
  private readonly chave = 'universo-literario.favoritos';

  readonly itens = signal<Livro[]>(this.carregarFavoritos());
  readonly quantidade = computed(() => this.itens().length);
  readonly total = computed(() => this.itens().reduce((acc, livro) => acc + (livro.preco || 0), 0));
  readonly aberto = signal(false);
  readonly aviso = signal('');

  abrir(): void {
    this.aberto.set(true);
  }

  fechar(): void {
    this.aberto.set(false);
  }

  alternarGaveta(): void {
    this.aberto.update((v) => !v);
  }

  mostrarAviso(msg: string): void {
    this.aviso.set(msg);
    setTimeout(() => {
      if (this.aviso() === msg) {
        this.aviso.set('');
      }
    }, 2800);
  }

  isFavorito(livroId: number): boolean {
    return this.itens().some((livro) => livro.id === livroId);
  }

  alternar(livro: Livro): boolean {
    const jaExiste = this.isFavorito(livro.id);
    if (jaExiste) {
      this.remover(livro.id);
      this.mostrarAviso(`"${livro.titulo}" foi removido dos favoritos.`);
      return false;
    } else {
      this.adicionar(livro);
      this.mostrarAviso(`"${livro.titulo}" foi salvo nos favoritos!`);
      return true;
    }
  }

  adicionar(livro: Livro): void {
    if (!this.isFavorito(livro.id)) {
      this.atualizar([...this.itens(), livro]);
    }
  }

  remover(livroId: number): void {
    this.atualizar(this.itens().filter((livro) => livro.id !== livroId));
  }

  limpar(): void {
    this.atualizar([]);
  }

  private carregarFavoritos(): Livro[] {
    return this.storage.get<Livro[]>(this.chave) ?? [];
  }

  private atualizar(itens: Livro[]): void {
    this.itens.set(itens);
    this.storage.set(this.chave, itens);
  }
}
