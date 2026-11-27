import { Test, TestingModule } from '@nestjs/testing';
import { PerfilUsuario } from '../auth/schemas/usuario.schema';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';

describe('FavoritosController', () => {
  let controller: FavoritosController;

  const mockFavoritosService = {
    findAllByUsuario: jest.fn(),
    create: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  };

  const mockReq = {
    user: {
      sub: '6745a1b2c3d4e5f6a7b8c9d1',
      email: 'ana@universoliterario.com',
      nome: 'Ana Leitora',
      perfil: PerfilUsuario.LEITOR,
    },
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritosController],
      providers: [{ provide: FavoritosService, useValue: mockFavoritosService }],
    }).compile();

    controller = module.get<FavoritosController>(FavoritosController);
  });

  it('deve listar favoritos do usuário autenticado', async () => {
    mockFavoritosService.findAllByUsuario.mockResolvedValue({ itens: [], quantidade: 0, total: 0 });
    const result = await controller.findAll(mockReq);

    expect(mockFavoritosService.findAllByUsuario).toHaveBeenCalledWith(mockReq.user.sub);
    expect(result.quantidade).toBe(0);
  });

  it('deve alternar favorito delegando ao serviço', async () => {
    mockFavoritosService.toggle.mockResolvedValue({ favorito: true });
    const result = await controller.toggle(mockReq, '6745a1b2c3d4e5f6a7b8c9d0');

    expect(mockFavoritosService.toggle).toHaveBeenCalledWith(
      mockReq.user.sub,
      '6745a1b2c3d4e5f6a7b8c9d0',
    );
    expect(result.favorito).toBe(true);
  });

  it('deve limpar todos os favoritos do usuário', async () => {
    mockFavoritosService.clear.mockResolvedValue(undefined);
    await controller.clear(mockReq);

    expect(mockFavoritosService.clear).toHaveBeenCalledWith(mockReq.user.sub);
  });
});
