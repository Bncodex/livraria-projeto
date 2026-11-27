/**
 * Mapa centralizado das rotas da API REST e do Edge Gateway.
 */
export const API_ROUTES = {
  PREFIX: 'api/v1',
  DOCS: 'api/docs',
  EDGE_GATEWAY: 'api/edge/gateway',
  HEALTH: {
    BASE: 'health',
  },
  AUTH: {
    BASE: 'auth',
    REGISTER: 'register',
    LOGIN: 'login',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    ME: 'me',
  },
  LIVROS: {
    BASE: 'livros',
    BY_ID: ':id',
  },
  FAVORITOS: {
    BASE: 'favoritos',
    BY_LIVRO_ID: ':livroId',
    TOGGLE: ':livroId/toggle',
  },
  PEDIDOS: {
    BASE: 'pedidos',
    BY_ID: ':id',
    UPDATE_STATUS: ':id/status',
  },
} as const;
