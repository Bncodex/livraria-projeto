import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TemaService } from '../../services/tema.service';

@Component({
  selector: 'app-conta-conectada',
  imports: [RouterLink],
  templateUrl: './conta-conectada.html',
  styleUrl: './conta-conectada.css',
})
export class ContaConectada {
  readonly auth = inject(AuthService);
  readonly tema = inject(TemaService);
  sair(): void {
    this.auth.logout();
  }
}
