import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EnderecoViaCep { cep: string; logradouro: string; complemento: string; bairro: string; localidade: string; uf: string; erro?: boolean; }

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  constructor(private readonly http: HttpClient) {}
  buscar(cep: string): Observable<EnderecoViaCep> { return this.http.get<EnderecoViaCep>(`https://viacep.com.br/ws/${cep}/json/`); }
}
