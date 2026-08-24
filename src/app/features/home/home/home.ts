import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';


@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, ContaConectada],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  readonly destaques = [
    {
      titulo: 'A biblioteca da meia-noite',
      autor: 'Matt Haig',
      cor: 'midnight',
      tag: 'Mais vendido'
    },
    {
      titulo: 'O sol é para todos',
      autor: 'Harper Lee',
      cor: 'sunset',
      tag: 'Clássico'
    },
    {
      titulo: 'Torto Arado',
      autor: 'Itamar Vieira Junior',
      cor: 'earth',
      tag: 'Nacional'
    },
    {
      titulo: 'Orgulho e Preconceito',
      autor: 'Jane Austen',
      cor: 'rose',
      tag: 'Romance'
    }
  ];

}