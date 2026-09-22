import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { StatusEmail } from './status-email';
import { DadosNotificacaoCompra } from '../../models/email.model';

describe('StatusEmail', () => {
  let component: StatusEmail;
  let fixture: ComponentFixture<StatusEmail>;

  const dadosMock: DadosNotificacaoCompra = {
    destinatario: 'Bern1822@outlook.com',
    to_email: 'Bern1822@outlook.com',
    pedido_id: 999,
    data_compra: '22/09/2026 14:00',
    nome_cliente: 'Bernardo',
    email_cliente: 'bernardo@teste.com',
    telefone_cliente: '11999999999',
    cpf_cliente: '12345678901',
    endereco_entrega: 'Rua das Flores, 100',
    itens_pedido: '• Livro Angular (Qtd: 1) - R$ 50,00',
    valor_total: 'R$ 50,00',
    quantidade_itens: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusEmail],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusEmail);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o estado de carregamento quando enviando for true', () => {
    component.enviando = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Enviando notificação do pedido');
    expect(compiled.textContent).toContain('Bern1822@outlook.com');
  });

  it('deve exibir o estado de sucesso com resumo da compra', () => {
    component.sucesso = true;
    component.dados = dadosMock;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('E-mail enviado com sucesso');
    expect(compiled.textContent).toContain('Bern1822@outlook.com');
    expect(compiled.textContent).toContain('Bernardo');
    expect(compiled.textContent).toContain('R$ 50,00');
    expect(compiled.textContent).toContain('Livro Angular');
  });

  it('deve exibir mensagem de erro quando o envio falhar', () => {
    component.erro = 'Chave pública inválida';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Não foi possível enviar o e-mail');
    expect(compiled.textContent).toContain('Chave pública inválida');
  });
});
