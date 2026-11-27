import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Universo Literário — API Back-end')
    .setDescription(
      [
        'Documentação técnica da API REST da Livraria **Universo Literário**.',
        '',
        '### Arquitetura',
        '- **Framework:** NestJS + Mongoose (preparado para MongoDB Atlas)',
        '- **Segurança:** Helmet, CORS, Rate Limiting, sanitização NoSQL e JWT Bearer Auth',
        '- **Execução:** Suporte a servidor tradicional, Serverless Function (Node.js) e Edge Runtime (Gateway/Health)',
        '- **Padronização:** Status codes semânticos, validação via DTOs e filtro global de exceções',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Informe o token JWT retornado em POST /api/v1/auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Verificação de saúde da API e status da conexão MongoDB')
    .addTag('Auth', 'Registro, autenticação JWT (HttpOnly Cookie + Bearer), refresh e logout')
    .addTag('Livros', 'CRUD completo do catálogo de livros')
    .addTag('Favoritos', 'CRUD de livros favoritos do usuário autenticado')
    .addTag('Pedidos', 'CRUD e acompanhamento de pedidos (rotas protegidas por JWT)')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Universo Literário — Swagger Docs',
  });
}
