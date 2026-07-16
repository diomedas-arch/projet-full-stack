import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accueil'
  },
  {
    path: 'accueil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/accueil/accueil').then((m) => m.Accueil)
  },
  {
    path: 'filieres',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/filieres/filiere-list/filiere-list').then((m) => m.FiliereList)
  },
  {
    path: 'cursus',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cursus/cursus-list/cursus-list').then((m) => m.CursusList)
  },
  {
    path: 'cours',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cours/cours-list/cours-list').then((m) => m.CoursList)
  },
  {
    path: 'cours/nouveau',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cours/cours-form/cours-form').then((m) => m.CoursForm)
  },
  {
    path: 'cours/:id/modifier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cours/cours-form/cours-form').then((m) => m.CoursForm)
  },
  {
    path: 'cours/:id',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cours/cours-detail/cours-detail').then((m) => m.CoursDetail)
  },
  {
    path: 'promotions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/promotions/promotion-list/promotion-list').then((m) => m.PromotionList)
  },
  {
    path: 'promotions/nouveau',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/promotions/promotion-form/promotion-form').then((m) => m.PromotionForm)
  },
  {
    path: 'promotions/:id/modifier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/promotions/promotion-form/promotion-form').then((m) => m.PromotionForm)
  },
  {
    path: 'promotions/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/promotions/promotion-detail/promotion-detail').then((m) => m.PromotionDetail)
  },
  {
    path: 'cours-planifies',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/cours-planifies/planning-list/planning-list').then((m) => m.PlanningList)
  },
  {
    path: 'cours-planifies/nouveau',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () =>
      import('./features/cours-planifies/cours-planifie-form/cours-planifie-form').then((m) => m.CoursPlanifieForm)
  },
  {
    path: 'cours-planifies/:id/modifier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () =>
      import('./features/cours-planifies/cours-planifie-form/cours-planifie-form').then((m) => m.CoursPlanifieForm)
  },
  {
    path: 'eleves',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/eleves/eleve-list/eleve-list').then((m) => m.EleveList)
  },
  {
    path: 'eleves/nouveau',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/eleves/eleve-form/eleve-form').then((m) => m.EleveForm)
  },
  {
    path: 'eleves/:id/modifier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    loadComponent: () => import('./features/eleves/eleve-form/eleve-form').then((m) => m.EleveForm)
  },
  {
    path: 'utilisateurs',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./features/utilisateurs/utilisateur-list/utilisateur-list').then((m) => m.UtilisateurList)
  },
  {
    path: 'utilisateurs/nouveau',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () =>
      import('./features/utilisateurs/utilisateur-form/utilisateur-form').then((m) => m.UtilisateurForm)
  },
  {
    path: 'utilisateurs/:id/modifier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () =>
      import('./features/utilisateurs/utilisateur-form/utilisateur-form').then((m) => m.UtilisateurForm)
  },
  {
    path: 'mon-calendrier',
    canActivate: [authGuard],
    data: { roles: ['ROLE_ELEVE'] },
    loadComponent: () =>
      import('./features/espace/calendrier-eleve/calendrier-eleve').then((m) => m.CalendrierEleveComponent)
  },
  {
    path: 'mes-cours',
    canActivate: [authGuard],
    data: { roles: ['ROLE_FORMATEUR'] },
    loadComponent: () => import('./features/espace/cours-formateur/cours-formateur').then((m) => m.CoursFormateurComponent)
  },
  {
    path: '**',
    redirectTo: 'accueil'
  }
];
