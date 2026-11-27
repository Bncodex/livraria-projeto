import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Livro } from '../livros/schemas/livro.schema';
import { FavoritosService } from './favoritos.service';
import { Favorito } from './schemas/favorito.schema';

describe('FavoritosService', () => {
  let service: FavoritosService;

  const usuarioId = new Types.ObjectId().toString();
  const livroId = new Types.ObjectId().toString();

  const mockFavoritoModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockLivroModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritosService,
        { provide: getModelToken(Favorito.name), useValue: mockFavoritoModel },
        { provide: getModelToken(Livro.name), useValue: mockLivroModel },
      ],
    }).compile();

    service = module.get<FavoritosService>(FavoritosService);
  });

  it('deve adicionar livro aos favoritos quando existir e não estiver duplicado', async () => {
    mockLivroModel.findById.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ _id: livroId, titulo: 'Dom Casmurro', preco: 35.5 }),
    });
    mockFavoritoModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    mockFavoritoModel.create.mockResolvedValue({ usuarioId, livroId });

    const criado = await service.create(usuarioId, { livroId });
    expect(criado).toEqual({ usuarioId, livroId });
  });

  it('deve lançar ConflictException (409) se o livro já estiver nos favoritos', async () => {
    mockLivroModel.findById.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ _id: livroId }),
    });
    mockFavoritoModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ _id: 'fav-1' }),
    });

    await expect(service.create(usuarioId, { livroId })).rejects.toThrow(ConflictException);
  });

  it('deve listar favoritos calculando quantidade e total', async () => {
    mockFavoritoModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        { livroId: { _id: new Types.ObjectId(), titulo: 'Livro A', preco: 40 } },
        { livroId: { _id: new Types.ObjectId(), titulo: 'Livro B', preco: 29.9 } },
      ]),
    });

    const result = await service.findAllByUsuario(usuarioId);
    expect(result.quantidade).toBe(2);
    expect(result.total).toBe(69.9);
  });

  it('deve alternar (toggle) removendo quando já é favorito', async () => {
    mockFavoritoModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: 'fav-1' }),
    });
    mockFavoritoModel.deleteOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    const result = await service.toggle(usuarioId, livroId);
    expect(result.favorito).toBe(false);
  });

  it('deve lançar NotFoundException (404) ao remover favorito inexistente', async () => {
    mockFavoritoModel.findOneAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.remove(usuarioId, livroId)).rejects.toThrow(NotFoundException);
  });
});
