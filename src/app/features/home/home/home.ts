import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContaConectada } from '../../../core/components/conta-conectada/conta-conectada';
import { FavoritosFacade } from '../../../core/facades/favoritos.facade';
import { Livro } from '../../../core/models/livro.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, ContaConectada],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnDestroy {
  readonly favoritos: FavoritosFacade;
  readonly exibindoReverso = signal(false);

  private rafId: number | null = null;
  private revertendo = false;
  private capturando = false;
  private framesCapturados: HTMLCanvasElement[] = [];
  private ultimoFrameTs = 0;

  constructor() {
    try {
      this.favoritos = inject(FavoritosFacade);
    } catch {
      this.favoritos = {
        itens: () => [],
        quantidade: () => 0,
        total: () => 0,
        isFavorito: () => false,
        alternar: () => false,
        abrir: () => undefined,
        fechar: () => undefined,
      } as unknown as FavoritosFacade;
    }
  }

  readonly destaques: (Livro & { precoFormatado: string })[] = [
    { id: 13, titulo: 'Eu e Esse Meu Coração', autor: 'C. C. Hunter', imagem: '/images/eueessemeucoracao.jpeg', genero: 'Romance', preco: 41.9, precoFormatado: 'R$ 41,90', sinopse: 'Leah recebe um transplante de coração e passa a lidar com memórias, mistérios e sentimentos que transformam sua vida.' },
    { id: 14, titulo: 'Harry Potter e as Relíquias da Morte', autor: 'J. K. Rowling', imagem: '/images/harrypotter.jpeg', genero: 'Fantasia', preco: 49.9, precoFormatado: 'R$ 49,90', sinopse: 'No confronto final contra Voldemort, Harry, Rony e Hermione procuram as Horcruxes e descobrem o peso das Relíquias da Morte.' },
    { id: 15, titulo: 'João e o Pé de Feijão', autor: 'Igor Barbosa', imagem: '/images/joaoeopedefeijao.jpeg', genero: 'Conto infantil', preco: 24.9, precoFormatado: 'R$ 24,90', sinopse: 'Um clássico conto de aventura em que João troca um bem precioso por feijões mágicos e encontra um mundo acima das nuvens.' },
    { id: 16, titulo: 'O Alienista', autor: 'Machado de Assis', imagem: '/images/oalienista.jpeg', genero: 'Literatura brasileira', preco: 26.9, precoFormatado: 'R$ 26,90', sinopse: 'Dr. Simão Bacamarte decide estudar a loucura em Itaguaí, levando a cidade a questionar quem realmente é são.' },
  ];

  iniciarVideoPingPong(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    video.muted = true;
    this.revertendo = false;
    this.exibindoReverso.set(false);

    const w = video.videoWidth || 960;
    const h = video.videoHeight || 540;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    video.play().catch(() => undefined);

    if (this.framesCapturados.length === 0 && !this.capturando && typeof document !== 'undefined') {
      this.capturando = true;
      this.ultimoFrameTs = performance.now();

      const capturarFrame = (agora: number) => {
        if (!this.capturando || this.revertendo || video.paused || video.ended) {
          return;
        }
        // Captura síncrona a ~25fps para reprodução reversa imediata
        if (agora - this.ultimoFrameTs >= 38 && video.readyState >= 2) {
          this.ultimoFrameTs = agora;
          const off = document.createElement('canvas');
          off.width = w;
          off.height = h;
          const offCtx = off.getContext('2d');
          if (offCtx) {
            offCtx.drawImage(video, 0, 0, w, h);
            this.framesCapturados.push(off);
          }
        }
        this.rafId = requestAnimationFrame(capturarFrame);
      };

      this.rafId = requestAnimationFrame(capturarFrame);
    }
  }

  reverterVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    if (this.revertendo || typeof window === 'undefined') {
      return;
    }

    this.capturando = false;

    if (this.framesCapturados.length < 5) {
      video.currentTime = 0;
      video.play().catch(() => undefined);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      video.currentTime = 0;
      video.play().catch(() => undefined);
      return;
    }

    this.revertendo = true;
    let idx = this.framesCapturados.length - 1;

    // Desenha o último quadro e ativa o canvas via Signal imediatamente
    ctx.drawImage(this.framesCapturados[idx], 0, 0, canvas.width, canvas.height);
    this.exibindoReverso.set(true);

    // Já rebobina o vídeo oculto para 0:00s enquanto o canvas toca de trás para frente
    video.currentTime = 0;
    this.ultimoFrameTs = performance.now();

    const desenharReverso = (agora: number) => {
      if (!this.revertendo) {
        return;
      }

      if (agora - this.ultimoFrameTs >= 38) {
        this.ultimoFrameTs = agora;
        idx--;

        if (idx < 0) {
          this.revertendo = false;
          this.exibindoReverso.set(false);
          video.play().catch(() => undefined);
          return;
        }

        const frame = this.framesCapturados[idx];
        if (frame) {
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        }
      }

      this.rafId = requestAnimationFrame(desenharReverso);
    };

    this.rafId = requestAnimationFrame(desenharReverso);
  }

  ngOnDestroy(): void {
    this.revertendo = false;
    this.capturando = false;
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
    }
    this.framesCapturados = [];
  }

  alternarFavorito(livro: Livro, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.favoritos.alternar(livro);
  }
}
