import { Routes } from '@angular/router';
import { CardsList } from './components/cards-list/cards-list';

export const routes: Routes = [
  { path: '', component: CardsList },
  { path: '**', redirectTo: '' }
];
