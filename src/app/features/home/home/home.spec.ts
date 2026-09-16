import { render, screen } from '@testing-library/angular'; // render (renderiza - roda e coloca na tela) monta o componente no ambiente de teste
import { describe, it, expect } from 'vitest'; // expect - pega a resposta e compara, dizendo se está correto ou não
import { Home } from './home';

describe('Home Component', () => { // describe - descreve o grupo de testes todo
  // TESTE 1: Vitest Puro (Testa só a lógica no código - caixa branca)
  it('deve rodar o Home sem erros', () => {
    const component = new Home();
    expect(component).toBeTruthy(); // Garante que a variável component existe e foi criada sem falhas de código.
  });

  // TESTE 2: Angular Testing Library (Verifica se o texto do banner aparece na Tela)
  it('deve exibir o banner na tela', async () => {  // it - um teste específico - explica o que ele deve fazer
    await render(Home);
    expect(screen.getByText(/seu próximo mundo começa aqui/i)).toBeTruthy(); // busca na tela um texto que se pareça e combine com esse
  });

  // TESTE 3: Angular Testing Library (Testa a presença do botão "Comprar livros")
  it('deve exibir o botão de comprar livros na tela', async () => {
    await render(Home); // Desenha o componente na memória

    // Procura o texto do botão diretamente na tela
    const botaoComprar = screen.getByText(/comprar livros/i); // o teste ignora a diferença entre letras maiúsculas e minúsculas ao procurar a frase na tela.

    // 3. Valida se o botão realmente existe e está visível
    expect(botaoComprar).toBeTruthy();
  });
});
