import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import { Compras } from './compras';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { Livro } from '../../../core/models/livro.model';
// Teste Vitest de carrinho. Adiciona, remove e diminui.
describe('Compras', () => {
  let component: Compras;
  let fixture: ComponentFixture<Compras>;

  const carrinhoMock = {
    adicionar: vi.fn(),
    diminuir: vi.fn(),
    remover: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compras, RouterTestingModule],
      providers: [
        {
          provide: CarrinhoFacade,
          useValue: carrinhoMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Compras);
    component = fixture.componentInstance;

    carrinhoMock.adicionar.mockClear();
  });

  it('deve adicionar um livro ao carrinho', () => {
    
    const livro: Livro = {
      id: 1,
      titulo: '1984',
      autor: 'George Orwell',
      preco: 39.9,
      imagem: '/images/1984.jpeg',
      genero: 'Distopia clássica',
      sinopse: 'Uma sociedade vigiada pelo Grande Irmão.',
    };


    component.adicionar(livro);

  
    expect(carrinhoMock.adicionar).toHaveBeenCalledWith(livro);
  });
});
