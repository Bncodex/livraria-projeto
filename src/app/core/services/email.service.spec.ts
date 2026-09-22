import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import emailjs from '@emailjs/browser';
import { EmailService, DadosClienteForm } from './email.service';
import { Pedido } from '../models/pedido.model';
import { DadosNotificacaoCompra } from '../models/email.model';

describe('EmailService', () => {
  let service: EmailService;

  const pedidoMock: Pedido = {
    id: 123456789,
    criadoEm: '2026-09-22T14:30:00.000Z',
    total: 79.8,
    itens: [
      {
        livro: {
          id: 1,
          titulo: 'O Pequeno Príncipe',
          autor: 'Antoine de Saint-Exupéry',
          preco: 39.9,
          imagem: 'pequeno-principe.jpg',
          genero: 'Fábula',
          sinopse: 'História poética.',
        },
        quantidade: 2,
      },
    ],
  };

  const clienteMock: DadosClienteForm = {
    nome: 'Bernardo Silva',
    email: 'cliente@teste.com',
    telefone: '11988887777',
    cpf: '12345678901',
    endereco: 'Rua das Flores',
    numero: '100',
    complemento: 'Apto 12',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01234000',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailService],
    });
    service = TestBed.inject(EmailService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve ser criado com as credenciais corretas', () => {
    expect(service).toBeTruthy();
    expect(service.serviceId).toBe('service_b7u13ob');
    expect(service.templateId).toBe('template_ps6mama');
    expect(service.emailDestino).toBe('Bern1822@outlook.com');
  });

  it('deve montar os dados do e-mail com as informações personalizadas da compra', () => {
    const dados = service.montarDadosEmail(pedidoMock, clienteMock);

    expect(dados.destinatario).toBe('Bern1822@outlook.com');
    expect(dados.to_email).toBe('Bern1822@outlook.com');
    expect(dados.pedido_id).toBe(123456789);
    expect(dados.nome_cliente).toBe('Bernardo Silva');
    expect(dados.email_cliente).toBe('cliente@teste.com');
    expect(dados.telefone_cliente).toBe('11988887777');
    expect(dados.cpf_cliente).toBe('12345678901');
    expect(dados.endereco_entrega).toContain('Rua das Flores, 100');
    expect(dados.endereco_entrega).toContain('(Apto 12)');
    expect(dados.endereco_entrega).toContain('São Paulo/SP');
    expect(dados.endereco_entrega).toContain('01234000');
    expect(dados.itens_pedido).toContain('O Pequeno Príncipe (Qtd: 2) - R$ 79,80');
    expect(dados.valor_total).toBe('R$ 79,80');
    expect(dados.quantidade_itens).toBe(2);
    expect(dados.data_compra).toBeDefined();
  });

  it('deve enviar o e-mail com sucesso e retornar status 200', async () => {
    const dadosEnvio: DadosNotificacaoCompra = service.montarDadosEmail(pedidoMock, clienteMock);

    const sendSpy = vi.spyOn(emailjs, 'send').mockResolvedValue({
      status: 200,
      text: 'OK',
    });

    const resultado = await service.enviarNotificacaoCompra(dadosEnvio);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      'service_b7u13ob',
      'template_ps6mama',
      expect.objectContaining({
        destinatario: 'Bern1822@outlook.com',
        nome_cliente: 'Bernardo Silva',
        valor_total: 'R$ 79,80',
        itens_pedido: expect.stringContaining('O Pequeno Príncipe'),
      }),
      expect.any(String)
    );

    expect(resultado.sucesso).toBe(true);
    expect(resultado.status).toBe(200);
    expect(resultado.mensagem).toContain('sucesso');
  });

  it('deve capturar falha no envio do e-mail e retornar mensagem de erro', async () => {
    const dadosEnvio: DadosNotificacaoCompra = service.montarDadosEmail(pedidoMock, clienteMock);

    vi.spyOn(emailjs, 'send').mockRejectedValue({
      status: 400,
      text: 'The Public Key is invalid',
    });

    const resultado = await service.enviarNotificacaoCompra(dadosEnvio);

    expect(resultado.sucesso).toBe(false);
    expect(resultado.status).toBe(400);
    expect(resultado.mensagem).toBe('The Public Key is invalid');
  });
});
