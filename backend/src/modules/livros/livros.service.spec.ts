import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LivrosService } from './livros.service';
import { Livro } from './schemas/livro.schema';

describe('LivrosService', () => {
  let service: LivrosService;

  const mockLivro = {
    _id: '6745a1b2c3d4e5f6a7b8c9d0',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    preco: 39.9,
    imagem: '/images/pequeno-principe.jpg',
    sinopse: 'Clássico da literatura mundial.',
    genero: 'Fábula',
    estoque: 10,
    ativo: true,
  };

  const mockLivroModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockLivro, ...dto }),
  }));

  mockLivroModel.find = jest.fn();
  mockLivroModel.countDocuments = jest.fn();
  mockLivroModel.findById = jest.fn();
  mockLivroModel.findByIdAndUpdate = jest.fn();
  mockLivroModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivrosService,
        {
          provide: getModelToken(Livro.name),
          useValue: mockLivroModel,
        },
      ],
    }).compile();

    service = module.get<LivrosService>(LivrosService);
  });

  it('deve criar um novo livro', async () => {
    const result = await service.create({
      titulo: mockLivro.titulo,
      autor: mockLivro.autor,
      preco: mockLivro.preco,
      imagem: mockLivro.imagem,
      sinopse: mockLivro.sinopse,
      genero: mockLivro.genero,
    });

    expect(result.titulo).toBe(mockLivro.titulo);
  });

  it('deve listar livros paginados com metadados', async () => {
    mockLivroModel.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockLivro]),
    });
    mockLivroModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });

    const result = await service.findAll({ page: 1, limit: 12, genero: 'Fábula' });

    expect(result.items).toHaveLength(1);
    expect(result.meta).toEqual({ total: 1, page: 1, limit: 12, totalPages: 1 });
  });

  it('deve lançar NotFoundException ao buscar livro inexistente', async () => {
    mockLivroModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOne('6745a1b2c3d4e5f6a7b8c9d0')).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um livro existente', async () => {
    mockLivroModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ ...mockLivro, preco: 45.0 }),
    });

    const atualizado = await service.update('6745a1b2c3d4e5f6a7b8c9d0', { preco: 45.0 });
    expect(atualizado.preco).toBe(45.0);
  });

  it('deve remover um livro existente', async () => {
    mockLivroModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockLivro),
    });

    await expect(service.remove('6745a1b2c3d4e5f6a7b8c9d0')).resolves.toBeUndefined();
  });
});
