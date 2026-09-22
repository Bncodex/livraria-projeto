import { Component, Input } from '@angular/core';
import { DadosNotificacaoCompra } from '../../models/email.model';

@Component({
  selector: 'app-status-email',
  imports: [],
  templateUrl: './status-email.html',
  styleUrl: './status-email.css',
})
export class StatusEmail {
  @Input() enviando = false;
  @Input() sucesso = false;
  @Input() erro = '';
  @Input() dados: DadosNotificacaoCompra | null = null;
}
