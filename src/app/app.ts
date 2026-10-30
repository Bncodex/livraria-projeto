import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { FavoritosDrawer } from './core/components/favoritos-drawer/favoritos-drawer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, FavoritosDrawer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.add('loaded');
    }
  }
}
