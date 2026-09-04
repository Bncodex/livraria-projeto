import { TestBed } from '@angular/core/testing';
import { Livro } from '../models/livro.model';
import { StorageService } from '../services/storage.service';
import { CarrinhoFacade } from './carrinho.facade';

describe('CarrinhoFacade', () => {
  let carrinho: CarrinhoFacade;

  const livro: Livro = {
    id: 1,
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    preco: 39.9,
    imagem: 'pequeno-principe.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarrinhoFacade,
        {
          provide: StorageService,
          useValue: { get: () => null, set: () => undefined },
        },
      ],
    });

    carrinho = TestBed.inject(CarrinhoFacade);
  });

  it('deve adicionar um livro ao carrinho e calcular o total', () => {
    carrinho.adicionar(livro);

    expect(carrinho.quantidade()).toBe(1);
    expect(carrinho.total()).toBe(39.9);
    expect(carrinho.itens()[0].livro.titulo).toBe('O Pequeno Príncipe');
  });
});
