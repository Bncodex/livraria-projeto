import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';

@Component({
  selector: 'sobre-nos',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ContaConectada],
  templateUrl: './sobre-nos.html',
  styleUrl: './sobre-nos.css',
})
export class SobreNosComponent {}