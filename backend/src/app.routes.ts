import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { FavoritosModule } from './modules/favoritos/favoritos.module';
import { LivrosModule } from './modules/livros/livros.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';

/**
 * Definição centralizada de rotas modulares do NestJS via RouterModule.
 *
 * Com o prefixo global `api/v1` (configurado em `main.ts`), os endpoints ficam:
 * - GET    /api/v1/health
 * - POST   /api/v1/auth/register      (grava cookies HttpOnly)
 * - POST   /api/v1/auth/login         (grava cookies HttpOnly)
 * - POST   /api/v1/auth/refresh       (renova cookies HttpOnly)
 * - POST   /api/v1/auth/logout        (limpa cookies HttpOnly)
 * - GET    /api/v1/auth/me
 * - GET    /api/v1/livros
 * - GET    /api/v1/livros/:id
 * - POST   /api/v1/livros
 * - PATCH  /api/v1/livros/:id
 * - DELETE /api/v1/livros/:id
 * - GET    /api/v1/favoritos
 * - POST   /api/v1/favoritos
 * - PATCH  /api/v1/favoritos/:livroId/toggle
 * - DELETE /api/v1/favoritos/:livroId
 * - DELETE /api/v1/favoritos
 * - GET    /api/v1/pedidos
 * - GET    /api/v1/pedidos/:id
 * - POST   /api/v1/pedidos
 * - PATCH  /api/v1/pedidos/:id/status
 * - DELETE /api/v1/pedidos/:id
 * - GET    /api/docs (Swagger)
 * - GET    /api/edge/gateway (Edge Runtime)
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: '', module: AuthModule },
      { path: '', module: LivrosModule },
      { path: '', module: FavoritosModule },
      { path: '', module: PedidosModule },
    ],
  },
];
