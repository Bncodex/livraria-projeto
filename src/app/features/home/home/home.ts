import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
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