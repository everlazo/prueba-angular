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

  it('should propagate error on failure', () => {
    let error: unknown;
    service.getCards().subscribe({ next: () => {}, error: (e) => (error = e) });

    const req = httpMock.expectOne('https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards');
    req.flush('boom', { status: 500, statusText: 'Server Error' });

    expect(error).toBeTruthy();
  });
});
