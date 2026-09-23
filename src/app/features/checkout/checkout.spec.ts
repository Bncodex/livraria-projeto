import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Checkout } from './checkout';
import { PedidosService } from '../../core/services/pedidos.service';
import { EmailService } from '../../core/services/email.service';
import { ViaCepService } from '../../core/services/viacep.service';
import { Pedido } from '../../core/models/pedido.model';
import { DadosNotificacaoCompra } from '../../core/models/email.model';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let pedidosServiceMock: { confirmar: ReturnType<typeof vi.fn> };
  let emailServiceMock: {
    montarDadosEmail: ReturnType<typeof vi.fn>;
    enviarNotificacaoCompra: ReturnType<typeof vi.fn>;
  };

  const pedidoMock: Pedido = {
    id: 987654,
    criadoEm: '2026-09-22T15:00:00.000Z',
    total: 39.9,
    itens: [
      {
        livro: {
          id: 1,
          titulo: 'O Pequeno Príncipe',
          autor: 'Antoine',
          preco: 39.9,
          imagem: '',
          genero: '',
          sinopse: '',
        },
        quantidade: 1,
      },
    ],
  };

  const dadosEmailMock: DadosNotificacaoCompra = {
    destinatario: 'Bern1822@outlook.com',
    to_email: 'Bern1822@outlook.com',
    pedido_id: 987654,
    data_compra: '22/09/2026 15:00',
    nome_cliente: 'Bernardo Silva',
    email_cliente: 'bernardo@teste.com',
    telefone_cliente: '11999999999',
    cpf_cliente: '12345678901',
    endereco_entrega: 'Rua A, 10',
    itens_pedido: '• O Pequeno Príncipe (Qtd: 1) - R$ 39,90',
    valor_total: 'R$ 39,90',
    quantidade_itens: 1,
  };

  beforeEach(async () => {
    pedidosServiceMock = {
      confirmar: vi.fn(),
    };

    emailServiceMock = {
      montarDadosEmail: vi.fn().mockReturnValue(dadosEmailMock),
      enviarNotificacaoCompra: vi.fn().mockResolvedValue({
        sucesso: true,
        status: 200,
        mensagem: 'E-mail enviado com sucesso',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [Checkout, RouterTestingModule],
      providers: [
        provideHttpClient(),
        { provide: PedidosService, useValue: pedidosServiceMock },
        { provide: EmailService, useValue: emailServiceMock },
        { provide: ViaCepService, useValue: { buscar: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve confirmar a compra e disparar o e-mail de notificação com sucesso', async () => {
    pedidosServiceMock.confirmar.mockReturnValue(pedidoMock);

    component.formulario.setValue({
      nome: 'Bernardo Silva',
      email: 'bernardo@teste.com',
      cpf: '12345678901',
      telefone: '11988887777',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: 'Bloco B',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01001000',
      titular: 'BERNARDO SILVA',
      cartao: '1234567812345678',
      validade: '12/28',
      cvv: '123',
    });

    await component.confirmarCompra();

    expect(pedidosServiceMock.confirmar).toHaveBeenCalledTimes(1);
    expect(component.compraConfirmada()).toBe(true);

    expect(emailServiceMock.montarDadosEmail).toHaveBeenCalledWith(
      pedidoMock,
      expect.objectContaining({
        nome: 'Bernardo Silva',
        email: 'bernardo@teste.com',
        cidade: 'São Paulo',
      })
    );

    expect(emailServiceMock.enviarNotificacaoCompra).toHaveBeenCalledWith(dadosEmailMock);
    expect(component.emailEnviado()).toBe(true);
    expect(component.enviandoEmail()).toBe(false);
    expect(component.erroEmail()).toBe('');
  });

  it('deve permitir simular compra mesmo se o carrinho estiver vazio', async () => {
    pedidosServiceMock.confirmar.mockReturnValue(null);

    await component.confirmarCompra();

    expect(component.compraConfirmada()).toBe(true);
    expect(emailServiceMock.enviarNotificacaoCompra).toHaveBeenCalled();
  });

  it('deve tratar erro caso o envio do e-mail falhe', async () => {
    pedidosServiceMock.confirmar.mockReturnValue(pedidoMock);
    emailServiceMock.enviarNotificacaoCompra.mockResolvedValue({
      sucesso: false,
      status: 400,
      mensagem: 'Falha no envio do e-mail',
    });

    await component.confirmarCompra();

    expect(component.compraConfirmada()).toBe(true);
    expect(component.emailEnviado()).toBe(false);
    expect(component.erroEmail()).toBe('Falha no envio do e-mail');
  });
});
