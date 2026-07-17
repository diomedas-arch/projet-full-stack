import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cours'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-form/login-form').then((m) => m.LoginForm)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'cours',
        loadComponent: () =>
          import('./features/cours/cours-list/cours-list').then((m) => m.CoursList)
      },
      {
        path: 'cours/nouveau',
        loadComponent: () =>
          import('./features/cours/cours-form/cours-form').then((m) => m.CoursForm)
      },
      {
        path: 'cours/:id/modifier',
        loadComponent: () =>
          import('./features/cours/cours-form/cours-form').then((m) => m.CoursForm)
      },
      {
        path: 'promotions',
        loadComponent: () =>
          import('./features/promotions/promotion-list/promotion-list').then(
            (m) => m.PromotionList
          )
      },
      {
        path: 'promotions/nouveau',
        loadComponent: () =>
          import('./features/promotions/promotion-form/promotion-form').then(
            (m) => m.PromotionForm
          )
      },
      {
        path: 'promotions/:id/modifier',
        loadComponent: () =>
          import('./features/promotions/promotion-form/promotion-form').then(
            (m) => m.PromotionForm
          )
      },
      {
        path: 'cours-planifies',
        loadComponent: () =>
          import('./features/cours-planifies/planning-list/planning-list').then(
            (m) => m.PlanningList
          )
      },
      {
        path: 'cours-planifies/nouveau',
        loadComponent: () =>
          import('./features/cours-planifies/cours-planifie-form/cours-planifie-form').then(
            (m) => m.CoursPlanifieForm
          )
      },
      {
        path: 'cours-planifies/:id/modifier',
        loadComponent: () =>
          import('./features/cours-planifies/cours-planifie-form/cours-planifie-form').then(
            (m) => m.CoursPlanifieForm
          )
      }
    ]
  }

  // Routes Cursus/Filiere - a ajouter par Sasha
];
