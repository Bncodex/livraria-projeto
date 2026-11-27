import { Test, TestingModule } from '@nestjs/testing';
import { LivrosController } from './livros.controller';
import { LivrosService } from './livros.service';

describe('LivrosController', () => {
  let controller: LivrosController;

  const mockLivrosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivrosController],
      providers: [
        {
          provide: LivrosService,
          useValue: mockLivrosService,
        },
      ],
    }).compile();

    controller = module.get<LivrosController>(LivrosController);
  });

  it('deve delegar listagem para LivrosService.findAll', async () => {
    mockLivrosService.findAll.mockResolvedValue({ items: [], meta: { total: 0 } });
    const result = await controller.findAll({ page: 1, limit: 12 });

    expect(mockLivrosService.findAll).toHaveBeenCalledWith({ page: 1, limit: 12 });
    expect(result.items).toEqual([]);
  });

  it('deve delegar remoção para LivrosService.remove', async () => {
    mockLivrosService.remove.mockResolvedValue(undefined);
    await controller.remove('6745a1b2c3d4e5f6a7b8c9d0');

    expect(mockLivrosService.remove).toHaveBeenCalledWith('6745a1b2c3d4e5f6a7b8c9d0');
  });
});
