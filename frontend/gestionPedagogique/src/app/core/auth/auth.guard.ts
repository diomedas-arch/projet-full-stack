import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RoleUtilisateur } from './auth.model';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.verifierSession()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const roles = route.data['roles'] as RoleUtilisateur[] | undefined;
  if (roles?.length && !auth.aUnRole(roles)) {
    return router.createUrlTree(['/accueil'], {
      queryParams: { acces: 'refuse' }
    });
  }

  return true;
};
