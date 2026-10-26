import { TestBed } from '@angular/core/testing';
import { Livro } from '../models/livro.model';
import { StorageService } from '../services/storage.service';
import { FavoritosFacade } from './favoritos.facade';

describe('FavoritosFacade', () => {
  let favoritos: FavoritosFacade;

  const livro: Livro = {
    id: 1,
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    preco: 39.9,
    imagem: 'pequeno-principe.jpg',
    genero: 'Fábula poética',
    sinopse: 'Uma viagem sobre amizade e o essencial.',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoritosFacade,
        {
          provide: StorageService,
          useValue: { get: () => null, set: () => undefined },
        },
      ],
    });

    favoritos = TestBed.inject(FavoritosFacade);
  });

  it('deve alternar favorito (adicionar e remover)', () => {
    expect(favoritos.isFavorito(1)).toBe(false);

    const adicionou = favoritos.alternar(livro);
    expect(adicionou).toBe(true);
    expect(favoritos.isFavorito(1)).toBe(true);
    expect(favoritos.quantidade()).toBe(1);
    expect(favoritos.total()).toBe(39.9);

    const removeu = favoritos.alternar(livro);
    expect(removeu).toBe(false);
    expect(favoritos.isFavorito(1)).toBe(false);
    expect(favoritos.quantidade()).toBe(0);
  });
});
