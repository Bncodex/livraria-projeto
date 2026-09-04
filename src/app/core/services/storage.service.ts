import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(chave: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(chave) ?? 'null') as T | null; } catch { return null; }
  }
  set<T>(chave: string, valor: T): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(chave, JSON.stringify(valor));
  }
  remove(chave: string): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(chave);
  }
}
