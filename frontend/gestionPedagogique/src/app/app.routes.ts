import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cours',
    loadComponent: () =>
      import('./features/cours/cours-list/cours-list').then((m) => m.CoursList)
  },
  {
    path: 'promotions',
    loadComponent: () =>
      import('./features/promotions/promotion-list/promotion-list').then((m) => m.PromotionList)
  },
  {
    path: 'cours-planifies',
    loadComponent: () =>
      import('./features/cours-planifies/planning-list/planning-list').then((m) => m.PlanningList)
  }

  // Routes Cursus/Filiere - a ajouter par Sasha
];


