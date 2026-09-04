# Universo Literário

Aplicação Angular de uma livraria com catálogo, sacola persistente, checkout, autenticação demonstrativa e tratamento de rotas inexistentes.

## Funcionalidades

- **Sacola:** livros podem ser adicionados e removidos na página `/comprar`. Os itens, a quantidade e o total ficam salvos no `localStorage`, portanto permanecem após atualizar ou reabrir a página.
- **Checkout:** em `/checkout`, o formulário valida os dados obrigatórios. CPF, telefone, CEP, número do endereço, cartão e CVV removem caracteres que não sejam números. O e-mail precisa ter formato válido, incluindo `@`.
- **ViaCEP:** ao sair do campo CEP com oito números, o sistema consulta `https://viacep.com.br/ws/{cep}/json/` e preenche endereço, complemento, bairro, cidade e UF. CEP inválido, não encontrado e falha de rede exibem mensagens de erro.
- **Login:** as páginas de compra e checkout são protegidas. Use uma das contas fictícias: `leitor@universoliterario.com` / `senha123` ou `ana@universoliterario.com` / `senha123`.
- **Sessão:** após o login é criado um token JWT demonstrativo, com validade de oito horas, salvo no `localStorage`. Assim, a sessão continua ao atualizar a página. Esta é uma simulação de front-end: uma autenticação JWT real precisa de um back-end que assine e valide o token em segurança.
- **Página 404:** qualquer rota que não existe mostra uma mensagem e um botão para retornar à home.

## Estrutura principal

- `src/app/core/models`: contratos de dados reutilizáveis, como `Livro`.
- `src/app/core/services`: serviços de infraestrutura e regras compartilhadas: `StorageService`, `AuthService` e `ViaCepService`.
- `src/app/core/facades`: estado de interface centralizado. `CarrinhoFacade` usa **Signals** para itens, quantidade e total.
- `src/app/core/guards`: `authGuard` bloqueia acesso a compra e checkout de usuários não autenticados e envia para o login.
- `src/app/features/auth`: tela de login.
- `src/app/features/checkout`: formulário de checkout e confirmação de pedido.
- `src/app/features/comprar`: catálogo e visualização da sacola.
- `src/app/features/pagina-nao-encontrada`: tela para rotas inválidas.
- `src/app/app.routes.ts`: define as rotas, a proteção com guard e o fallback 404.
- `src/app/app.config.ts`: registra roteamento e `HttpClient`, necessário para a consulta ao ViaCEP.
