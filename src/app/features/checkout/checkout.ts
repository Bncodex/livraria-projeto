import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ViaCepService } from '../../core/services/viacep.service';
import { ContaConectada } from '../../core/components/conta-conectada/conta-conectada';
import { PedidosService } from '../../core/services/pedidos.service';

@Component({ selector: 'app-checkout', imports: [ReactiveFormsModule, RouterLink, ContaConectada], templateUrl: './checkout.html', styleUrl: './checkout.css' })
export class Checkout {
  private readonly formBuilder = inject(FormBuilder); private readonly viaCep = inject(ViaCepService); private readonly pedidos = inject(PedidosService);
  readonly compraConfirmada = signal(false); readonly buscandoCep = signal(false); readonly erroCep = signal(''); readonly erroCompra = signal('');
  readonly formulario = this.formBuilder.nonNullable.group({
    nome: ['', Validators.required], email: ['', [Validators.required, Validators.email]], cpf: ['', [Validators.required, Validators.pattern(/^\d+$/)]], telefone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    endereco: ['', Validators.required], numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]], complemento: [''], bairro: ['', Validators.required], cidade: ['', Validators.required], uf: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]], cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    titular: ['', Validators.required], cartao: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]], validade: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]], cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });
  readonly errosFormulario = computed(() => {
    const campos: Record<string, string> = { nome: 'nome completo', email: 'e-mail válido com @', cpf: 'CPF com apenas números', telefone: 'telefone com apenas números', endereco: 'endereço', numero: 'número do endereço', bairro: 'bairro', cidade: 'cidade', uf: 'UF com duas letras', cep: 'CEP com 8 números', titular: 'nome no cartão', cartao: 'cartão com 13 a 19 números', validade: 'validade no formato MM/AA', cvv: 'CVV com 3 ou 4 números' };
    return Object.entries(campos).filter(([campo]) => this.formulario.controls[campo as keyof typeof this.formulario.controls].invalid).map(([, nome]) => nome);
  });
  somenteNumeros(campo: 'cpf' | 'telefone' | 'numero' | 'cep' | 'cartao' | 'cvv'): void { const controle = this.formulario.controls[campo]; controle.setValue(controle.value.replace(/\D/g, ''), { emitEvent: false }); }
  formatarValidade(): void { const controle = this.formulario.controls.validade; const numeros = controle.value.replace(/\D/g, '').slice(0, 4); controle.setValue(numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros, { emitEvent: false }); }
  buscarCep(): void {
    const cep = this.formulario.controls.cep.value; this.erroCep.set('');
    if (!/^\d{8}$/.test(cep)) { this.erroCep.set('Informe um CEP com 8 números.'); return; }
    this.buscandoCep.set(true);
    this.viaCep.buscar(cep).pipe(catchError(() => { this.erroCep.set('Não foi possível consultar o CEP. Tente novamente.'); return of(null); }), finalize(() => this.buscandoCep.set(false))).subscribe((endereco) => {
      if (!endereco) return; if (endereco.erro) { this.erroCep.set('CEP não encontrado. Confira os números informados.'); return; }
      this.formulario.patchValue({ endereco: endereco.logradouro, complemento: endereco.complemento, bairro: endereco.bairro, cidade: endereco.localidade, uf: endereco.uf });
    });
  }
  confirmarCompra(): void {
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); return; }
    if (!this.pedidos.confirmar()) { this.erroCompra.set('Sua sacola está vazia. Adicione um livro antes de finalizar a compra.'); return; }
    this.compraConfirmada.set(true);
  }
}
