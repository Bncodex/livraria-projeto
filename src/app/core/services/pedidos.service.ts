import { Injectable, computed, inject, signal } from '@angular/core';
import { CarrinhoFacade } from '../facades/carrinho.facade';
import { Pedido } from '../models/pedido.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly storage = inject(StorageService);
  private readonly carrinho = inject(CarrinhoFacade);
  private readonly chave = 'universo-literario.pedidos';
  readonly pedidos = signal<Pedido[]>(this.storage.get<Pedido[]>(this.chave) ?? []);
  readonly quantidade = computed(() => this.pedidos().length);

  confirmar(): Pedido | null {
    if (this.carrinho.quantidade() === 0) return null;

    const pedido: Pedido = {
      id: Date.now(),
      criadoEm: new Date().toISOString(),
      itens: this.carrinho.itens().map((item) => ({ ...item })),
      total: this.carrinho.total(),
    };
    this.pedidos.update((pedidos) => [pedido, ...pedidos]);
    this.storage.set(this.chave, this.pedidos());
    this.carrinho.limpar();
    return pedido;
  }
}
