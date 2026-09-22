import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { Pedido } from '../models/pedido.model';
import { DadosNotificacaoCompra, RespostaEnvioEmail } from '../models/email.model';

export interface DadosClienteForm {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  readonly serviceId = 'service_b7u13ob';
  readonly templateId = 'template_ps6mama';
  readonly emailDestino = 'Bern1822@outlook.com';

  /**
   * Substitua pela sua Public Key obtida no painel do EmailJS (Account -> Public Key).
   */
  private publicKey = 'dijSol-vc2R1LASLI';

  configurarPublicKey(key: string): void {
    this.publicKey = key;
  }

  obterPublicKey(): string {
    return this.publicKey;
  }

  montarDadosEmail(pedido: Pedido, cliente: DadosClienteForm): DadosNotificacaoCompra {
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(pedido.criadoEm));

    const itensFormatados = pedido.itens
      .map(
        (item) =>
          `• ${item.livro.titulo} (Qtd: ${item.quantidade}) - R$ ${(item.livro.preco * item.quantidade)
            .toFixed(2)
            .replace('.', ',')}`
      )
      .join('\n');

    const totalFormatado = `R$ ${pedido.total.toFixed(2).replace('.', ',')}`;

    const enderecoCompleto = [
      `${cliente.endereco}, ${cliente.numero}`,
      cliente.complemento ? `(${cliente.complemento})` : '',
      cliente.bairro,
      `${cliente.cidade}/${cliente.uf.toUpperCase()}`,
      `CEP: ${cliente.cep}`,
    ]
      .filter(Boolean)
      .join(' - ');

    const totalItens = pedido.itens.reduce((acc, item) => acc + item.quantidade, 0);

    return {
      destinatario: this.emailDestino,
      to_email: this.emailDestino,
      pedido_id: pedido.id,
      data_compra: dataFormatada,
      nome_cliente: cliente.nome,
      email_cliente: cliente.email,
      telefone_cliente: cliente.telefone,
      cpf_cliente: cliente.cpf,
      endereco_entrega: enderecoCompleto,
      itens_pedido: itensFormatados,
      valor_total: totalFormatado,
      quantidade_itens: totalItens,
    };
  }

  async enviarNotificacaoCompra(dados: DadosNotificacaoCompra): Promise<RespostaEnvioEmail> {
    try {
      const resposta: EmailJSResponseStatus = await emailjs.send(
        this.serviceId,
        this.templateId,
        dados as unknown as Record<string, unknown>,
        this.publicKey
      );

      return {
        sucesso: true,
        status: resposta.status,
        mensagem: 'Notificação de compra enviada com sucesso para o e-mail!',
      };
    } catch (erro: any) {
      console.error('Erro ao enviar e-mail pelo EmailJS:', erro);
      return {
        sucesso: false,
        status: erro?.status ?? 500,
        mensagem: erro?.text || erro?.message || 'Falha ao enviar e-mail de notificação.',
      };
    }
  }
}
