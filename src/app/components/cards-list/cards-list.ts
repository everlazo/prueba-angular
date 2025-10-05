import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { CardsService, Card } from '../../services/cards';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-cards-list',
  imports: [],
  templateUrl: './cards-list.html',
  styleUrl: './cards-list.scss'
})
export class CardsList implements OnInit, OnDestroy {
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly cards = signal<Card[]>([]);
  protected readonly currentSlide = signal(0);
  protected readonly cardsPerView = signal(3); // Número de tarjetas visibles por defecto
  
  private readonly document = inject(DOCUMENT);
  private resizeListener?: () => void;

  constructor(private readonly cardsService: CardsService) {
    this.cardsService
      .getCards()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (cards) => this.cards.set(cards),
        error: () => this.error.set('No se pudo cargar las tarjetas. Intenta nuevamente.')
      });
  }

  ngOnInit(): void {
    this.updateCardsPerView();
    this.resizeListener = () => this.updateCardsPerView();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  getCardClass(productName: string): string {
    switch (productName) {
      case 'CREA': return 'crea-card';
      case 'FIC':
      case 'FICS': return 'fic-card';
      default: return 'default-card';
    }
  }

  getProductDisplayName(productName: string): string {
    switch (productName) {
      case 'FICS':
      case 'FIC': return 'FIC Efectivo';
      case 'CREA': return 'Seguro de vida CREA';
      case 'MFUND': return 'MFUND';
      case 'BOLT': return 'BOLT';
      default: return productName;
    }
  }

  getBalanceLabel(productName: string): string {
    switch (productName) {
      case 'CREA': return 'Tu ahorro actual:';
      case 'FIC':
      case 'FICS': return 'Ya cuentas con:';
      default: return 'Ya cuentas con:';
    }
  }

  formatCurrency(amount: string): string {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numAmount);
  }

  getRecommendedAmount(productName: string): string {
    // Valores recomendados según el diseño
    switch (productName) {
      case 'FIC':
      case 'FICS': return '288.000';
      default: return '100.000';
    }
  }

  // Métodos para el slider
  nextSlide(): void {
    const maxSlide = Math.max(0, this.cards().length - this.cardsPerView());
    if (this.currentSlide() < maxSlide) {
      this.currentSlide.set(this.currentSlide() + 1);
    }
  }

  prevSlide(): void {
    if (this.currentSlide() > 0) {
      this.currentSlide.set(this.currentSlide() - 1);
    }
  }

  canGoNext(): boolean {
    const maxSlide = Math.max(0, this.cards().length - this.cardsPerView());
    return this.currentSlide() < maxSlide;
  }

  canGoPrev(): boolean {
    return this.currentSlide() > 0;
  }

  getSliderTransform(): string {
    const cardWidth = 100 / this.cardsPerView(); // Porcentaje de ancho por tarjeta
    return `translateX(-${this.currentSlide() * cardWidth}%)`;
  }

  private updateCardsPerView(): void {
    const width = window.innerWidth;
    let newCardsPerView = 3; // Desktop por defecto
    
    if (width <= 768) {
      newCardsPerView = 1; // Móvil
    } else if (width <= 1024) {
      newCardsPerView = 2; // Tablet
    }
    
    if (newCardsPerView !== this.cardsPerView()) {
      this.cardsPerView.set(newCardsPerView);
      // Resetear el slide actual si es necesario
      const maxSlide = Math.max(0, this.cards().length - newCardsPerView);
      if (this.currentSlide() > maxSlide) {
        this.currentSlide.set(maxSlide);
      }
    }
  }
}
