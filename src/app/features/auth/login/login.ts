import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
@Component({ selector: 'app-login', imports: [ReactiveFormsModule, RouterLink], templateUrl: './login.html', styleUrl: './login.css' })
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly erro = signal('');
  readonly formulario = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });
  entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { email, senha } = this.formulario.getRawValue();
    const erro = this.auth.login(email, senha);
    if (erro) {
      this.erro.set(erro);
      return;
    }
    this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/comprar');
  }
>>>>>>
}
