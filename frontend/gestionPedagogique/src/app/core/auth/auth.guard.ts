import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';

import { TokenStorageService } from './token-storage.service';

// route.data['roles'] est optionnel : quand absent, le guard ne vérifie que l'authentification
// (utilisé pour les listes, accessibles à tout utilisateur connecté). Quand présent, il exige
// en plus que le rôle courant figure dans la liste (utilisé sur les routes de création/édition).
export const authGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  if (!tokenStorage.estConnecte()) {
    return router.createUrlTree(['/login']);
  }

  const rolesRequis = route.data['roles'] as string[] | undefined;
  if (rolesRequis && !rolesRequis.includes(tokenStorage.role() ?? '')) {
    inject(MatSnackBar).open("Vous n'avez pas les droits nécessaires pour accéder à cette page.", 'Fermer', {
      duration: 5000,
      panelClass: 'snackbar-error'
    });
    const [, premierSegment] = state.url.split('/');
    return router.createUrlTree([`/${premierSegment}`]);
  }

  return true;
};
