import { Routes } from '@angular/router';

export const routes: Routes = [
  
    {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },

  {
    path: 'produtos',
    loadComponent: () => import('./features/produtos/produtos/produtos').then((m) => m.Produtos),
  },

  {
    path: 'sobre-nos',
    loadComponent: () => import('./features/sobre-nos/sobre-nos/sobre-nos').then((m) => m.SobreNos),
  },

   {
    path: '**',
    redirectTo: '',
  },
];
