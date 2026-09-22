import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ViaCepService } from '../../core/services/viacep.service';
import { ContaConectada } from '../../core/components/conta-conectada/conta-conectada';
import { StatusEmail } from '../../core/components/status-email/status-email';
import { PedidosService } from '../../core/services/pedidos.service';
import { EmailService } from '../../core/services/email.service';
import { DadosNotificacaoCompra } from '../../core/models/email.model';
import { Pedido } from '../../core/models/pedido.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, ContaConectada, StatusEmail],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly formBuilder = inject(FormBuilder);
  private readonly viaCep = inject(ViaCepService);
  private readonly pedidos = inject(PedidosService);
  private readonly emailService = inject(EmailService);

  readonly compraConfirmada = signal(false);
  readonly buscandoCep = signal(false);
  readonly erroCep = signal('');
  readonly erroCompra = signal('');

  // Sinais para controle do envio de e-mail
  readonly enviandoEmail = signal(false);
  readonly emailEnviado = signal(false);
  readonly erroEmail = signal('');
  readonly dadosEmail = signal<DadosNotificacaoCompra | null>(null);

  readonly formulario = this.formBuilder.nonNullable.group({
    nome: [''],
    email: [''],
    cpf: [''],
    telefone: [''],
    endereco: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    uf: [''],
    cep: [''],
    titular: [''],
    cartao: [''],
    validade: [''],
    cvv: [''],
  });

  somenteNumeros(campo: 'cpf' | 'telefone' | 'numero' | 'cep' | 'cartao' | 'cvv'): void {
    const controle = this.formulario.controls[campo];
    controle.setValue(controle.value.replace(/\D/g, ''), { emitEvent: false });
  }

  formatarValidade(): void {
    const controle = this.formulario.controls.validade;
    const numeros = controle.value.replace(/\D/g, '').slice(0, 4);
    controle.setValue(numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros, {
      emitEvent: false,
    });
  }

  buscarCep(): void {
    const cep = this.formulario.controls.cep.value;
    this.erroCep.set('');
    if (cep.length < 8) {
      return;
    }
    this.buscandoCep.set(true);
    this.viaCep
      .buscar(cep)
      .pipe(
        catchError(() => {
          this.erroCep.set('Não foi possível consultar o CEP. Tente novamente.');
          return of(null);
        }),
        finalize(() => this.buscandoCep.set(false))
      )
      .subscribe((endereco) => {
        if (!endereco) return;
        if (endereco.erro) {
          this.erroCep.set('CEP não encontrado. Confira os números informados.');
          return;
        }
        this.formulario.patchValue({
          endereco: endereco.logradouro || this.formulario.controls.endereco.value,
          complemento: endereco.complemento || this.formulario.controls.complemento.value,
          bairro: endereco.bairro || this.formulario.controls.bairro.value,
          cidade: endereco.localidade || this.formulario.controls.cidade.value,
          uf: endereco.uf || this.formulario.controls.uf.value,
        });
      });
  }

  async confirmarCompra(): Promise<void> {
    const valoresForm = this.formulario.getRawValue();

    // Obtém o pedido da sacola ou cria um pedido simulado caso o carrinho esteja vazio
    let pedido: Pedido | null = this.pedidos.confirmar();
    if (!pedido) {
      pedido = {
        id: Date.now(),
        criadoEm: new Date().toISOString(),
        itens: [
          {
            livro: {
              id: 1,
              titulo: 'O Pequeno Príncipe (Demonstração)',
              autor: 'Antoine de Saint-Exupéry',
              preco: 39.9,
              imagem: '',
              genero: 'Fábula',
              sinopse: 'Item para simulação de compra',
            },
            quantidade: 1,
          },
        ],
        total: 39.9,
      };
    }

    this.compraConfirmada.set(true);

    const dadosCliente = {
      nome: valoresForm.nome.trim() || 'Cliente Simulado',
      email: valoresForm.email.trim() || 'Bern1822@outlook.com',
      telefone: valoresForm.telefone.trim() || '11999999999',
      cpf: valoresForm.cpf.trim() || '12345678901',
      endereco: valoresForm.endereco.trim() || 'Rua de Teste',
      numero: valoresForm.numero.trim() || '100',
      complemento: valoresForm.complemento?.trim() || '',
      bairro: valoresForm.bairro.trim() || 'Bairro Simulado',
      cidade: valoresForm.cidade.trim() || 'São Paulo',
      uf: valoresForm.uf.trim() || 'SP',
      cep: valoresForm.cep.trim() || '01001000',
    };

    const dadosParaEmail = this.emailService.montarDadosEmail(pedido, dadosCliente);
    this.dadosEmail.set(dadosParaEmail);
    this.enviandoEmail.set(true);
    this.erroEmail.set('');

    try {
      const resposta = await this.emailService.enviarNotificacaoCompra(dadosParaEmail);
      if (resposta.sucesso) {
        this.emailEnviado.set(true);
      } else {
        this.erroEmail.set(resposta.mensagem);
      }
    } catch {
      this.erroEmail.set('Ocorreu uma instabilidade ao enviar o e-mail de confirmação.');
    } finally {
      this.enviandoEmail.set(false);
    }
  }
}
