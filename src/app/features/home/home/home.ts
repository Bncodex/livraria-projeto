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
    { titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', imagem: '/images/eueessemeucoracao.jpeg' },
    { titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', imagem: '/images/harrypotter.jpeg' },
    { titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', imagem: '/images/joaoeopedefeijao.jpeg' },
    { titulo: 'O Alienista', autor: 'Machado de Assis', imagem: '/images/oalienista.jpeg' },
  ];

}