import { Component, signal } from '@angular/core';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { finalize } from 'rxjs';
import { CardsService, Card } from '../../services/cards';

@Component({
  selector: 'app-cards-list',
  imports: [CurrencyPipe, NgClass, NgStyle],
  templateUrl: './cards-list.html',
  styleUrl: './cards-list.scss'
})
export class CardsList {
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly cards = signal<Card[]>([]);

  constructor(private readonly cardsService: CardsService) {
    this.cardsService
      .getCards()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (cards) => this.cards.set(cards),
        error: () => this.error.set('No se pudo cargar las tarjetas. Intenta nuevamente.')
      });
  }
}
