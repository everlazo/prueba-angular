import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { CardsService, Card } from './cards';

describe('Servicio de Tarjetas', () => {
  let servicio: CardsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    servicio = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería obtener tarjetas y mapear la lista de tarjetas', () => {
    const respuestaDePrueba = {
      listCard: [
        { nameProduct: 'MFUND', numberProduct: '123', balanceProduct: '1000', detaildProduct: 'Detalle' }
      ]
    };

    let resultado: Card[] | undefined;
    servicio.getCards().subscribe((tarjetas) => (resultado = tarjetas));

    const peticion = httpMock.expectOne('https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards');
    expect(peticion.request.method).toBe('GET');
    peticion.flush(respuestaDePrueba);

    expect(resultado).toBeDefined();
    expect(resultado!.length).toBe(1);
    expect(resultado![0].nameProduct).toBe('MFUND');
  });

  it('debería manejar errores de red e intentar el respaldo local', (done) => {
    const respuestaRespaldo = {
      listCard: [
        { nameProduct: 'LOCAL', numberProduct: '999', balanceProduct: '500', detaildProduct: 'Respaldo local' }
      ]
    };

    servicio.getCards().subscribe({
      next: (tarjetas) => {
        expect(tarjetas).toBeDefined();
        expect(tarjetas.length).toBe(1);
        expect(tarjetas[0].nameProduct).toBe('LOCAL');
        done();
      },
      error: (err) => {
        done.fail('No debería dar error cuando el respaldo funciona: ' + err);
      }
    });

    // Debido a retry(2), esperamos 3 peticiones a la URL remota (1 inicial + 2 reintentos)
    const peticiones = [];
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards');
      peticiones.push(req);
      req.flush('boom', { status: 500, statusText: 'Error del Servidor' });
    }

    // Después del fallo remoto, debe intentar el respaldo local
    const peticionRespaldo = httpMock.expectOne('/cards.mock.json');
    peticionRespaldo.flush(respuestaRespaldo);
  });
});
