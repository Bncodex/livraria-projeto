import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContaConectada } from '../../core/components/conta-conectada/conta-conectada';
import { PedidosService } from '../../core/services/pedidos.service';

@Component({
  selector: 'app-pedidos',
  imports: [RouterLink, CurrencyPipe, DatePipe, ContaConectada],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {
  readonly pedidos = inject(PedidosService);
}
