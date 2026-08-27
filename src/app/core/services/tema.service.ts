import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type Tema = 'claro' | 'escuro';

@Injectable({ providedIn: 'root' })
export class TemaService {
  private readonly storage = inject(StorageService);
  private readonly chave = 'universo-literario.tema';
  readonly tema = signal<Tema>(this.carregarTema());

  constructor() {
    this.aplicar();
  }

  alternar(): void {
    this.tema.update((tema) => (tema === 'claro' ? 'escuro' : 'claro'));
    this.storage.set(this.chave, this.tema());
    this.aplicar();
  }

  private carregarTema(): Tema {
    return this.storage.get<Tema>(this.chave) === 'escuro' ? 'escuro' : 'claro';
  }

  private aplicar(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset['tema'] = this.tema();
    }
  }
}
