import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { Livro } from '../../../core/models/livro.model';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CurrencyPipe, ContaConectada],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  readonly carrinho = inject(CarrinhoFacade);
  readonly livros: Livro[] = [
    { id: 1, titulo: '1984', autor: 'George Orwell', preco: 39.9, imagem: '/images/1984.jpeg' },
    { id: 2, titulo: 'A Cinco Passos de Você', autor: 'Rachael Lippincott', preco: 42.9, imagem: '/images/acincopassosdevoce.jpeg' },
    { id: 3, titulo: 'After', autor: 'Anna Todd', preco: 39.9, imagem: '/images/after.jpeg' },
    { id: 4, titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', preco: 34.9, imagem: '/images/ahoradaestrela.jpeg' },
    { id: 5, titulo: 'Alice no País das Maravilhas', autor: 'Lewis Carroll', preco: 29.9, imagem: '/images/alicenopaisdasmaravilhas.jpeg' },
    { id: 6, titulo: 'A Metamorfose', autor: 'Franz Kafka', preco: 27.9, imagem: '/images/ametamorfose.jpeg' },
    { id: 7, titulo: 'Amor & Gelato', autor: 'Jenna Evans Welch', preco: 44.9, imagem: '/images/amoregelato.jpeg' },
    { id: 8, titulo: 'As Crônicas de Nárnia', autor: 'C. S. Lewis', preco: 54.9, imagem: '/images/ascronicasdenarnia.jpeg' },
    { id: 9, titulo: 'A Vida Secreta da Idade Média', autor: 'Elena Percivaldi', preco: 47.9, imagem: '/images/avidasecretadaidademedia.jpeg' },
    { id: 10, titulo: 'A Vontade de Sentido', autor: 'Viktor E. Frankl', preco: 36.9, imagem: '/images/avontadedesentido.jpeg' },
    { id: 11, titulo: 'Diário de um Banana', autor: 'Jeff Kinney', preco: 32.9, imagem: '/images/diariodeumbananaaverdadenuaecrua.jpeg' },
    { id: 12, titulo: 'Drácula', autor: 'Bram Stoker', preco: 31.9, imagem: '/images/dracula.jpeg' },
    { id: 13, titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', preco: 41.9, imagem: '/images/eueessemeucoracao.jpeg' },
    { id: 14, titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', preco: 49.9, imagem: '/images/harrypotter.jpeg' },
    { id: 15, titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', preco: 24.9, imagem: '/images/joaoeopedefeijao.jpeg' },
    { id: 16, titulo: 'O Alienista', autor: 'Machado de Assis', preco: 26.9, imagem: '/images/oalienista.jpeg' },
    { id: 17, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', preco: 25.9, imagem: '/images/opequenoprincipe.jpeg' },
    { id: 18, titulo: 'O Senhor dos Anéis', autor: 'J. R. R. Tolkien', preco: 59.9, imagem: '/images/osenhordosaneis.jpeg' },
    { id: 19, titulo: 'Se Ele Estivesse Comigo', autor: 'Laura Nowlin', preco: 43.9, imagem: '/images/seeleestivesseaqui.jpeg' },
  ];
  adicionar(livro: Livro) { this.carrinho.adicionar(livro); }
  diminuir(index: number) { this.carrinho.diminuir(index); }
  remover(index: number) { this.carrinho.remover(index); }
}
