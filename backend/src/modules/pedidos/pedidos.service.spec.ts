import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PerfilUsuario } from '../auth/schemas/usuario.schema';
import { Livro } from '../livros/schemas/livro.schema';
import { PedidosService } from './pedidos.service';
import { Pedido, StatusPedido } from './schemas/pedido.schema';

describe('PedidosService', () => {
  let service: PedidosService;

  const livroId = new Types.ObjectId().toString();
  const usuarioId = new Types.ObjectId().toString();
  const outroUsuarioId = new Types.ObjectId().toString();

  const mockPedidoModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockLivroModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        { provide: getModelToken(Pedido.name), useValue: mockPedidoModel },
        { provide: getModelToken(Livro.name), useValue: mockLivroModel },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('deve calcular o total no servidor e criar o pedido', async () => {
    mockLivroModel.find.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        {
          _id: new Types.ObjectId(livroId),
          titulo: 'O Pequeno Príncipe',
          preco: 39.9,
          estoque: 5,
        },
      ]),
    });

    mockPedidoModel.create.mockImplementation((data) => Promise.resolve(data));

    const pedido = await service.create(usuarioId, {
      itens: [{ livroId, quantidade: 2 }],
      enderecoEntrega: {
        cep: '01001000',
        endereco: 'Praça da Sé',
        numero: '100',
        bairro: 'Sé',
        cidade: 'São Paulo',
        uf: 'sp',
      },
    });

    expect(pedido.total).toBe(79.8);
    expect(pedido.enderecoEntrega.uf).toBe('SP');
  });

  it('deve lançar BadRequestException quando o estoque for insuficiente', async () => {
    mockLivroModel.find.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        {
          _id: new Types.ObjectId(livroId),
          titulo: 'O Pequeno Príncipe',
          preco: 39.9,
          estoque: 1,
        },
      ]),
    });

    await expect(
      service.create(usuarioId, {
        itens: [{ livroId, quantidade: 3 }],
        enderecoEntrega: {
          cep: '01001000',
          endereco: 'Praça da Sé',
          numero: '100',
          bairro: 'Sé',
          cidade: 'São Paulo',
          uf: 'SP',
        },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar ForbiddenException (403) se leitor tentar acessar pedido de outro usuário', async () => {
    mockPedidoModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: new Types.ObjectId(),
        usuarioId: new Types.ObjectId(outroUsuarioId),
        status: StatusPedido.CONFIRMADO,
      }),
    });

    await expect(
      service.findOne(new Types.ObjectId().toString(), usuarioId, PerfilUsuario.LEITOR),
    ).rejects.toThrow(ForbiddenException);
  });
});
