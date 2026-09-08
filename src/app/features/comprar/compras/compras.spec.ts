import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';

import { Compras } from './compras';

describe('Compras', () => {
  let component: Compras;
  let fixture: ComponentFixture<Compras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compras, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Teste usando Vitest
  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});


describe('Compras - Angular Testing Library', () => {

  // Teste usando Angular Testing Library
  it('deve adicionar um livro na sacola', async () => {

    const carrinhoMock = {
      adicionar: vi.fn(),
      quantidade: vi.fn(() => 0)
    };

    await render(Compras, {
      imports: [RouterTestingModule],
      providers: [
        {
          provide: CarrinhoFacade,
          useValue: carrinhoMock
        }
      ]
    });

    const botoes = screen.getAllByRole('button', {
      name: 'Adicionar à sacola'
    });

    await fireEvent.click(botoes[0]);

    expect(carrinhoMock.adicionar).toHaveBeenCalled();
  });

});