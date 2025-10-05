import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CardsList } from './cards-list';
import { CardsService, Card } from '../../services/cards';

describe('CardsList', () => {
  let component: CardsList;
  let fixture: ComponentFixture<CardsList>;
  let cardsService: jasmine.SpyObj<CardsService>;
  let httpMock: HttpTestingController;

  const mockCards: Card[] = [
    {
      nameProduct: 'MFUND',
      numberProduct: '123456',
      balanceProduct: '1000000',
      detaildProduct: 'Test card'
    }
  ];

  beforeEach(async () => {
    const cardsServiceSpy = jasmine.createSpyObj('CardsService', ['getCards']);

    await TestBed.configureTestingModule({
      imports: [CardsList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CardsService, useValue: cardsServiceSpy }
      ]
    }).compileComponents();

    cardsService = TestBed.inject(CardsService) as jasmine.SpyObj<CardsService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    cardsService.getCards.and.returnValue(of(mockCards));
    
    fixture = TestBed.createComponent(CardsList);
    component = fixture.componentInstance;
    
    expect(component).toBeTruthy();
  });

  it('should load cards successfully', () => {
    cardsService.getCards.and.returnValue(of(mockCards));
    
    fixture = TestBed.createComponent(CardsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.cards()).toEqual(mockCards);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('should handle error when loading cards fails', () => {
    cardsService.getCards.and.returnValue(throwError(() => new Error('Network error')));
    
    fixture = TestBed.createComponent(CardsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.cards()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('No se pudo cargar las tarjetas. Intenta nuevamente.');
  });

  it('should format currency correctly', () => {
    cardsService.getCards.and.returnValue(of(mockCards));
    
    fixture = TestBed.createComponent(CardsList);
    component = fixture.componentInstance;
    
    // Test that the function returns a valid currency format
    const result1 = component.formatCurrency('1000000');
    const result2 = component.formatCurrency('500000');
    
    expect(result1).toContain('1.000.000');
    expect(result1).toContain('$');
    expect(result2).toContain('500.000');
    expect(result2).toContain('$');
  });
});
