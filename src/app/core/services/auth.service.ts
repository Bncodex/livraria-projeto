import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface Usuario { nome: string; email: string; }
interface Sessao extends Usuario { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly chave = 'universo-literario.sessao';
  private readonly sessao = signal<Sessao | null>(this.storage.get<Sessao>(this.chave));
  readonly usuario = computed(() => this.sessao());
  readonly estaLogado = computed(() => this.tokenValido(this.sessao()?.token));

  constructor() {
    if (!this.estaLogado()) this.logout();
  }

  login(email: string, senha: string): string | null {
    const contas = [
      { nome: 'Leitor(a) do Universo', email: 'leitor@universoliterario.com', senha: 'senha123' },
      { nome: 'Ana Leitora', email: 'ana@universoliterario.com', senha: 'senha123' },
    ];
    const conta = contas.find((item) => item.email === email.trim().toLowerCase() && item.senha === senha);
    if (!conta) return 'E-mail ou senha inválidos. Use uma das contas demonstrativas abaixo.';
    const sessao: Sessao = { nome: conta.nome, email: conta.email, token: this.criarToken(conta.nome, conta.email) };
    this.sessao.set(sessao);
    this.storage.set(this.chave, sessao);
    return null;
  }

  logout(): void { this.sessao.set(null); this.storage.remove(this.chave); }

  private criarToken(nome: string, email: string): string {
    const codificar = (valor: object) => btoa(unescape(encodeURIComponent(JSON.stringify(valor)))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    return `${codificar({ alg: 'HS256', typ: 'JWT' })}.${codificar({ sub: email, nome, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 })}.assinatura-demonstrativa`;
  }

  private tokenValido(token?: string): boolean {
    if (!token) return false;
    try {
      const payload = token.split('.')[1];
      const json = decodeURIComponent(escape(atob(payload.replaceAll('-', '+').replaceAll('_', '/'))));
      return JSON.parse(json).exp > Math.floor(Date.now() / 1000);
    } catch { return false; }
  }
}
