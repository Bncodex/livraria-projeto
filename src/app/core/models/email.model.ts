export interface DadosNotificacaoCompra {
  destinatario: string;
  to_email: string;
  pedido_id: number | string;
  data_compra: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
  cpf_cliente: string;
  endereco_entrega: string;
  itens_pedido: string;
  valor_total: string;
  quantidade_itens: number;
}

export interface RespostaEnvioEmail {
  sucesso: boolean;
  status?: number;
  mensagem: string;
}
