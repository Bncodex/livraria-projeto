import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { fireEvent, render, screen } from '@testing-library/angular';

import { AuthService } from '../../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  beforeEach(() => localStorage.clear());

  it('autentica uma conta fictícia e direciona para a página inicial', async () => {
    await render(Login, { routes: [{ path: '', component: Login }] });

    fireEvent.input(screen.getByLabelText(/e-mail/i), {
      target: { value: 'leitor@universoliterario.com' },
    });
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: 'senha123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);

    expect(auth.estaLogado()).toBe(true);
    expect(router.url).toBe('/');
  });
});
