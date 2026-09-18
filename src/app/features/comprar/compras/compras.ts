import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { Livro } from '../../../core/models/livro.model';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CurrencyPipe, ContaConectada, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  readonly carrinho = inject(CarrinhoFacade);
  readonly livroSelecionado = signal<Livro | null>(null);
  readonly busca = signal('');
  readonly categoriaAtiva = signal('Todos');
  readonly aviso = signal('');
  readonly categorias = ['Todos', 'Romance', 'Fantasia', 'Literatura brasileira', 'Clássicos', 'Infantojuvenil'];
  readonly livros: Livro[] = [
    { id: 1, titulo: '1984', autor: 'George Orwell', preco: 39.9, imagem: '/images/1984.jpeg', genero: 'Distopia clássica', sinopse: 'Em uma sociedade vigiada pelo Grande Irmão, Winston Smith começa a questionar as verdades impostas pelo Estado e arrisca tudo em busca de liberdade.' },
    { id: 2, titulo: 'A Cinco Passos de Você', autor: 'Rachael Lippincott', preco: 42.9, imagem: '/images/acincopassosdevoce.jpeg', genero: 'Romance contemporâneo', sinopse: 'Stella e Will vivem no mesmo hospital e se apaixonam, mas precisam manter distância para proteger a saúde um do outro.' },
    { id: 3, titulo: 'After', autor: 'Anna Todd', preco: 39.9, imagem: '/images/after.jpeg', genero: 'Romance jovem adulto', sinopse: 'A vida organizada de Tessa muda ao conhecer Hardin, um rapaz intenso que a faz rever planos, certezas e sentimentos.' },
    { id: 4, titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', preco: 34.9, imagem: '/images/ahoradaestrela.jpeg', genero: 'Literatura brasileira', sinopse: 'Macabéa, uma jovem nordestina vivendo no Rio de Janeiro, revela com delicadeza e crueza a invisibilidade de tantas vidas.' },
    { id: 5, titulo: 'Alice no País das Maravilhas', autor: 'Lewis Carroll', preco: 29.9, imagem: '/images/alicenopaisdasmaravilhas.jpeg', genero: 'Fantasia clássica', sinopse: 'Ao seguir um coelho apressado, Alice cai em um mundo fantástico de enigmas, criaturas excêntricas e regras às avessas.' },
    { id: 6, titulo: 'A Metamorfose', autor: 'Franz Kafka', preco: 27.9, imagem: '/images/ametamorfose.jpeg', genero: 'Ficção filosófica', sinopse: 'Gregor Samsa acorda transformado em um inseto e vê sua relação com a família, o trabalho e a própria identidade se desfazer.' },
    { id: 7, titulo: 'Amor & Gelato', autor: 'Jenna Evans Welch', preco: 44.9, imagem: '/images/amoregelato.jpeg', genero: 'Romance jovem adulto', sinopse: 'Na Toscana, Lina descobre segredos da mãe e encontra novas amizades, paisagens inesquecíveis e a possibilidade de um grande amor.' },
    { id: 8, titulo: 'As Crônicas de Nárnia', autor: 'C. S. Lewis', preco: 54.9, imagem: '/images/ascronicasdenarnia.jpeg', genero: 'Fantasia épica', sinopse: 'Através de um guarda-roupa, crianças chegam a Nárnia, uma terra mágica ameaçada por um inverno sem fim.' },
    { id: 9, titulo: 'A Vida Secreta da Idade Média', autor: 'Elena Percivaldi', preco: 47.9, imagem: '/images/avidasecretadaidademedia.jpeg', genero: 'História', sinopse: 'Uma viagem curiosa pelo cotidiano medieval, revelando hábitos, crenças e personagens além dos castelos e das batalhas.' },
    { id: 10, titulo: 'A Vontade de Sentido', autor: 'Viktor E. Frankl', preco: 36.9, imagem: '/images/avontadedesentido.jpeg', genero: 'Psicologia', sinopse: 'Viktor Frankl apresenta reflexões sobre a busca humana por propósito e como o sentido pode orientar escolhas e superações.' },
    { id: 11, titulo: 'Diário de um Banana', autor: 'Jeff Kinney', preco: 32.9, imagem: '/images/diariodeumbananaaverdadenuaecrua.jpeg', genero: 'Infantojuvenil', sinopse: 'Greg Heffley relata, com humor, os desafios e confusões de sobreviver à escola e à vida em família.' },
    { id: 12, titulo: 'Drácula', autor: 'Bram Stoker', preco: 31.9, imagem: '/images/dracula.jpeg', genero: 'Terror gótico', sinopse: 'Cartas e diários acompanham a chegada do enigmático conde Drácula e a luta de seus perseguidores contra uma ameaça sombria.' },
    { id: 13, titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', preco: 41.9, imagem: '/images/eueessemeucoracao.jpeg', genero: 'Romance jovem adulto', sinopse: 'Leah recebe um transplante de coração e passa a lidar com memórias, mistérios e sentimentos que transformam sua vida.' },
    { id: 14, titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', preco: 49.9, imagem: '/images/harrypotter.jpeg', genero: 'Fantasia', sinopse: 'No confronto final contra Voldemort, Harry, Rony e Hermione procuram as Horcruxes e descobrem o peso das Relíquias da Morte.' },
    { id: 15, titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', preco: 24.9, imagem: '/images/joaoeopedefeijao.jpeg', genero: 'Conto infantil', sinopse: 'Um clássico conto de aventura em que João troca um bem precioso por feijões mágicos e encontra um mundo acima das nuvens.' },
    { id: 16, titulo: 'O Alienista', autor: 'Machado de Assis', preco: 26.9, imagem: '/images/oalienista.jpeg', genero: 'Literatura brasileira', sinopse: 'Dr. Simão Bacamarte decide estudar a loucura em Itaguaí, levando a cidade a questionar quem realmente é são.' },
    { id: 17, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', preco: 25.9, imagem: '/images/opequenoprincipe.jpeg', genero: 'Fábula poética', sinopse: 'Um piloto conhece um pequeno viajante de outro planeta e aprende, com ele, sobre amizade, cuidado e aquilo que é essencial.' },
    { id: 18, titulo: 'O Senhor dos Anéis', autor: 'J. R. R. Tolkien', preco: 59.9, imagem: '/images/osenhordosaneis.jpeg', genero: 'Fantasia épica', sinopse: 'Frodo parte em uma jornada pela Terra-média para destruir um anel capaz de devolver o poder ao sombrio Sauron.' },
    { id: 19, titulo: 'Se Ele Estivesse Comigo', autor: 'Laura Nowlin', preco: 43.9, imagem: '/images/seeleestivesseaqui.jpeg', genero: 'Romance dramático', sinopse: 'Outono revisita sua amizade com Finn e imagina os caminhos que poderiam ter seguido, entre afeto, escolhas e despedidas.' },
  ];

  readonly livrosFiltrados = computed(() => {
    const termo = this.normalizar(this.busca());
    const categoria = this.categoriaAtiva();
    return this.livros.filter((livro) => {
      const combinaBusca = !termo || this.normalizar(`${livro.titulo} ${livro.autor} ${livro.genero}`).includes(termo);
      const genero = livro.genero.toLowerCase();
      const combinaCategoria = categoria === 'Todos'
        || (categoria === 'Clássicos' && genero.includes('clássic'))
        || genero.includes(categoria.toLowerCase());
      return combinaBusca && combinaCategoria;
    });
  });

  adicionar(livro: Livro) {
    this.carrinho.adicionar(livro);
    this.aviso.set(`${livro.titulo} foi adicionado à sacola.`);
    setTimeout(() => this.aviso.set(''), 2600);
  }
  diminuir(index: number) { this.carrinho.diminuir(index); }
  remover(index: number) { this.carrinho.remover(index); }
  abrirDetalhes(livro: Livro) { this.livroSelecionado.set(livro); }
  fecharDetalhes() { this.livroSelecionado.set(null); }
  selecionarCategoria(categoria: string) { this.categoriaAtiva.set(categoria); }

  private normalizar(valor: string) {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc() { this.fecharDetalhes(); }
}
