import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface Card {
  nameProduct: string;
  numberProduct: string;
  balanceProduct: string;
  detaildProduct: string;
}

interface CardsResponse {
  listCard: Card[];
}

const CARDS_ENDPOINT = 'https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards';

@Injectable({ providedIn: 'root' })
export class CardsService {
  constructor(private readonly http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<CardsResponse>(CARDS_ENDPOINT).pipe(
      map((resp) => resp.listCard ?? []),
      catchError((err) => {
        console.error('[CardsService] Error fetching cards', err);
        return throwError(() => new Error('No se pudo cargar la información de tarjetas'));
      })
    );
  }
}
