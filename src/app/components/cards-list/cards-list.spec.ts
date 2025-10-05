import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CardsList } from './cards-list';
import { CardsService, Card } from '../../services/cards';

describe('Componente Lista de Tarjetas', () => {
  let componente: CardsList;
  let fixture: ComponentFixture<CardsList>;
  let servicioTarjetas: jasmine.SpyObj<CardsService>;
  let httpMock: HttpTestingController;

  const tarjetasDePrueba: Card[] = [
    {
      nameProduct: 'MFUND',
      numberProduct: '123456',
      balanceProduct: '1000000',
      detaildProduct: 'Tarjeta de prueba'
    }
  ];

  beforeEach(async () => {
    const servicioTarjetasSpy = jasmine.createSpyObj('CardsService', ['getCards']);

    await TestBed.configureTestingModule({
      imports: [CardsList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CardsService, useValue: servicioTarjetasSpy }
      ]
    }).compileComponents();

    servicioTarjetas = TestBed.inject(CardsService) as jasmine.SpyObj<CardsService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería crear el componente correctamente', () => {
    servicioTarjetas.getCards.and.returnValue(of(tarjetasDePrueba));
    
    fixture = TestBed.createComponent(CardsList);
    componente = fixture.componentInstance;
    
    expect(componente).toBeTruthy();
  });

  it('debería cargar las tarjetas exitosamente', () => {
    servicioTarjetas.getCards.and.returnValue(of(tarjetasDePrueba));
    
    fixture = TestBed.createComponent(CardsList);
    componente = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(componente.cards()).toEqual(tarjetasDePrueba);
    expect(componente.loading()).toBeFalse();
    expect(componente.error()).toBeNull();
  });

  it('debería manejar errores cuando falla la carga de tarjetas', () => {
    servicioTarjetas.getCards.and.returnValue(throwError(() => new Error('Error de red')));
    
    fixture = TestBed.createComponent(CardsList);
    componente = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(componente.cards()).toEqual([]);
    expect(componente.loading()).toBeFalse();
    expect(componente.error()).toBe('No se pudo cargar las tarjetas. Intenta nuevamente.');
  });

  it('debería formatear la moneda correctamente', () => {
    servicioTarjetas.getCards.and.returnValue(of(tarjetasDePrueba));
    
    fixture = TestBed.createComponent(CardsList);
    componente = fixture.componentInstance;
    
    // Verificar que la función devuelve un formato de moneda válido
    const resultado1 = componente.formatCurrency('1000000');
    const resultado2 = componente.formatCurrency('500000');
    
    expect(resultado1).toContain('1.000.000');
    expect(resultado1).toContain('$');
    expect(resultado2).toContain('500.000');
    expect(resultado2).toContain('$');
  });
});
