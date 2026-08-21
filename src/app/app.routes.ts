import { Routes } from '@angular/router';
import { SobreNosComponent } from './features/sobre-nos/sobre-nos/sobre-nos';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  
    {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },

  {
    path: 'comprar',
    loadComponent: () => import('./features/comprar/compras/compras').then((m) => m.Compras),
    canActivate: [authGuard],
  },

  {
    path: 'sobre-nos',
    loadComponent: () => import('./features/sobre-nos/sobre-nos/sobre-nos').then(m => m.SobreNosComponent),
  },

  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    loadComponent: () => import('./features/pagina-nao-encontrada/pagina-nao-encontrada').then((m) => m.PaginaNaoEncontrada),
  },
];
