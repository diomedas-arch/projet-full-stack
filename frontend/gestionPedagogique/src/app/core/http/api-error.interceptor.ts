import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { TokenStorageService } from '../auth/token-storage.service';
import { ApiError } from './api-error.model';
import { SKIP_ERROR_NOTIFICATION } from './skip-error-notification';

const URL_LOGIN = '/api/auth/login';

// Parse le format d'erreur standard du backend :
// { timestamp, status, erreur, message, chemin, details }
// et ne remonte jamais l'objet JSON brut à l'utilisateur.
//
// Gère aussi la déconnexion automatique sur 401 (token absent/invalide/expiré côté
// Spring Security, à ne pas confondre avec un 403 = rôle insuffisant) : c'est ici plutôt
// que dans auth.interceptor.ts car ce dernier ne s'occupe que d'attacher le token sur la
// requête sortante et n'a pas de logique d'erreur ; l'interceptor d'erreur, lui, parse déjà
// chaque réponse en échec et connaît le statut HTTP normalisé, donc un seul endroit pour
// réagir aux erreurs plutôt que deux catchError distincts. On exclut /api/auth/login pour
// qu'un mauvais mot de passe (401 lui aussi) ne redirige pas la page de login elle-même.
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError = toApiError(error);

      if (apiError.status === 401 && req.url !== URL_LOGIN) {
        tokenStorage.effacer();
        router.navigateByUrl('/login');
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
