import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { CardsService, Card } from './cards';

describe('CardsService', () => {
  let service: CardsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cards and map listCard', () => {
    const mockResponse = {
      listCard: [
        { nameProduct: 'MFUND', numberProduct: '123', balanceProduct: '1000', detaildProduct: 'Detalle' }
      ]
    };

    let result: Card[] | undefined;
    service.getCards().subscribe((cards) => (result = cards));

    const req = httpMock.expectOne('https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].nameProduct).toBe('MFUND');
  });

  it('should handle network error and try fallback', (done) => {
    const fallbackResponse = {
      listCard: [
        { nameProduct: 'LOCAL', numberProduct: '999', balanceProduct: '500', detaildProduct: 'Local fallback' }
      ]
    };

    service.getCards().subscribe({
      next: (cards) => {
        expect(cards).toBeDefined();
        expect(cards.length).toBe(1);
        expect(cards[0].nameProduct).toBe('LOCAL');
        done();
      },
      error: (err) => {
        done.fail('Should not error when fallback succeeds: ' + err);
      }
    });

    // Debido a retry(2), esperamos 3 peticiones a la URL remota (1 inicial + 2 reintentos)
    const requests = [];
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards');
      requests.push(req);
      req.flush('boom', { status: 500, statusText: 'Server Error' });
    }

    // Después del fallo remoto, debe intentar el fallback local
    const fallbackReq = httpMock.expectOne('/cards.mock.json');
    fallbackReq.flush(fallbackResponse);
  });
});
