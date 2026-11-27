# Universo Literário — Back-end (NestJS + Mongoose)

Estrutura de back-end construída com **NestJS**, **Mongoose** (preparada para **MongoDB Atlas**), **Swagger**, **tratamento global de erros**, **middlewares de proteção**, **status codes semânticos**, **Serverless Function** e **Edge Runtime**.

## Estrutura de Pastas

```text
backend/
├── api/
│   ├── index.ts                 # Serverless Function (Node.js) com cache da instância NestJS
│   └── edge/
│       └── gateway.ts           # Edge Runtime (V8 Isolate) para baixa latência na borda
├── src/
│   ├── main.ts                  # Bootstrap local + configuração global (Helmet, CORS, ValidationPipe, Swagger)
│   ├── app.module.ts            # Módulo raiz (Config, Throttler, Database, Auth, Livros, Pedidos)
│   ├── common/
│   │   ├── config/              # Swagger / OpenAPI
│   │   ├── filters/             # AllExceptionsFilter (HTTP + Mongoose ValidationError/CastError/11000)
│   │   ├── interceptors/        # Padronização de resposta (statusCode, timestamp, path, data)
│   │   ├── middlewares/         # SecurityMiddleware (NoSQL sanitization + headers) e LoggerMiddleware
│   │   └── pipes/               # ParseObjectIdPipe (validação de ObjectId do MongoDB)
│   ├── database/
│   │   └── database.module.ts   # Conexão Mongoose configurada para MongoDB Atlas e Serverless
│   └── modules/
│       ├── health/              # GET /api/v1/health
│       ├── auth/                # POST /auth/register, POST /auth/login, GET /auth/me (JWT + bcrypt)
│       ├── livros/              # CRUD completo (/api/v1/livros)
│       └── pedidos/             # CRUD protegido por JWT (/api/v1/pedidos)
├── .env.example                 # Variáveis de ambiente (incluindo MONGODB_URI para Atlas)
└── vercel.json                  # Roteamento híbrido Serverless + Edge
```

## Como Rodar Localmente (quando configurar o MongoDB Atlas)

1. Copie `.env.example` para `.env` e preencha `MONGODB_URI` com a connection string do MongoDB Atlas e `JWT_SECRET`.
2. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
3. Inicie em modo desenvolvimento:
   ```bash
   npm run start:dev
   ```
4. Acesse a documentação Swagger:
   - `http://localhost:3000/api/docs`
