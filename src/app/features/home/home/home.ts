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
    { titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', imagem: '/images/eueessemeucoracao.jpeg', genero: 'Romance', preco: 'R$ 41,90' },
    { titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', imagem: '/images/harrypotter.jpeg', genero: 'Fantasia', preco: 'R$ 49,90' },
    { titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', imagem: '/images/joaoeopedefeijao.jpeg', genero: 'Infantil', preco: 'R$ 24,90' },
    { titulo: 'O Alienista', autor: 'Machado de Assis', imagem: '/images/oalienista.jpeg', genero: 'Literatura brasileira', preco: 'R$ 26,90' },
  ];

}
