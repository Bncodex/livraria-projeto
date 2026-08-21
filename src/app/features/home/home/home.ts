import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
<<<<<<< HEAD
  standalone: true,
  imports: [],
=======
  imports: [RouterLink, RouterLinkActive],
>>>>>>> master
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
<<<<<<< HEAD
  livros = [
    {
      titulo: 'Descubra seu Compras',
      autor: 'Itam Kaison',
      preco: 49.9,
      imagem: 'assets/livro1.jpg',
    },

    {
      titulo: 'The Esoroe ad the Comusias Moe',
      autor: 'Itam Kaison',
      preco: 49.9,
      imagem: 'assets/livro2.jpg',
    },

    {
      titulo: 'The Lábora Comprale',
      autor: 'Itam Kaison',
      preco: 49.9,
      imagem: 'assets/livro3.jpg',
    },

    {
      titulo: 'Doitor e Editora, beu Geer',
      autor: 'Itam Kaison',
      preco: 49.9,
      imagem: 'assets/livro4.jpg',
    },

    {
      titulo: 'Descarte ao Doação',
      autor: 'Itam Kaison',
      preco: 49.9,
      imagem: 'assets/livro5.jpg',
    },

    {
      titulo: 'Hontr Gbrety',
      autor: 'Rama Boison',
      preco: 49.9,
      imagem: 'assets/livro6.jpg',
    },

    {
      titulo: 'Honth Carrey',
      autor: 'Rene Oeson',
      preco: 49.9,
      imagem: 'assets/livro7.jpg',
    },

    {
      titulo: 'This Miorhung',
      autor: 'Statshow',
      preco: 49.9,
      imagem: 'assets/livro8.jpg',
    },

    {
      titulo: 'Uisistf Mocson',
      autor: 'Rama Boison',
      preco: 49.9,
      imagem: 'assets/livro9.jpg',
    },

    {
      titulo: 'Cathien Barretto',
      autor: 'Rama Boison',
      preco: 49.9,
      imagem: 'assets/livro10.jpg',
    },
  ];
}
=======
  readonly destaques = [
    { titulo: 'A biblioteca da meia-noite', autor: 'Matt Haig', cor: 'midnight', tag: 'Mais vendido' },
    { titulo: 'O sol é para todos', autor: 'Harper Lee', cor: 'sunset', tag: 'Clássico' },
    { titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', cor: 'earth', tag: 'Nacional' },
    { titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', cor: 'rose', tag: 'Romance' },
  ];
}
>>>>>>> master
