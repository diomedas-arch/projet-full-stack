import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ApiError } from './api-error.model';
import { SKIP_ERROR_NOTIFICATION } from './skip-error-notification';

// Parse le format d'erreur standard du backend :
// { timestamp, status, erreur, message, chemin, details }
// et ne remonte jamais l'objet JSON brut à l'utilisateur.
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError = toApiError(error);
      const loginRequest = req.url.includes('/api/auth/login');

      if (apiError.status === 401 && !loginRequest) {
        const returnUrl = router.url && router.url !== '/login' ? router.url : '/accueil';
        auth.logout();
        router.navigate(['/login'], {
          queryParams: { session: 'expiree', returnUrl }
        });
        return throwError(() => ({
          ...apiError,
          message: 'Votre session a expiré. Veuillez vous reconnecter.'
        } satisfies ApiError));
      }

      if (apiError.status === 403 && !loginRequest) {
        router.navigate(['/accueil'], {
          queryParams: { acces: 'refuse' }
        });
      }

      if (!req.context.get(SKIP_ERROR_NOTIFICATION)) {
        snackBar.open(apiError.message, 'Fermer', {
          duration: 4000,
          panelClass: 'snackbar-error'
        });
      }

      return throwError(() => apiError);
    })
  );
};

function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    if (body && typeof body === 'object' && typeof body.message === 'string') {
      return {
        timestamp: body.timestamp,
        status: typeof body.status === 'number' ? body.status : error.status,
        erreur: body.erreur,
        message: body.message,
        chemin: body.chemin,
        details: body.details
      };
    }

    return {
      status: error.status,
      message:
        error.status === 0
          ? 'Impossible de contacter le serveur.'
          : `Une erreur est survenue (code ${error.status}).`
    };
  }

  return { status: 0, message: 'Une erreur inattendue est survenue.' };
}
