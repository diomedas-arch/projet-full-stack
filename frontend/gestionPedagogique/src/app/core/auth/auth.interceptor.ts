import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenStorageService } from './token-storage.service';

const URL_LOGIN = '/api/auth/login';

// Attache le header Authorization à chaque requête /api/**, sauf sur /api/auth/login
// lui-même (on n'a pas encore de token avant d'être connecté).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api') || req.url === URL_LOGIN) {
    return next(req);
  }

  const token = inject(TokenStorageService).lire();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  );
};
