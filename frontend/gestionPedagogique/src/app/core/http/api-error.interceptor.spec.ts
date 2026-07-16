import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const authMock = { logout: jasmine.createSpy('logout') };
  const snackBarMock = { open: jasmine.createSpy('open') };

  beforeEach(() => {
    authMock.logout.calls.reset();
    snackBarMock.open.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('nettoie la session et redirige au login sur 401 hors login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    http.get('/api/cours').subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/cours');
    req.flush({ message: 'Authentification requise.' }, { status: 401, statusText: 'Unauthorized' });

    expect(authMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { session: 'expiree', returnUrl: '/' }
    });
  });

  it('redirige vers accueil sur 403 et affiche le message backend', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    http.get('/api/utilisateurs').subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/utilisateurs');
    req.flush({ message: 'Droits insuffisants.' }, { status: 403, statusText: 'Forbidden' });

    expect(router.navigate).toHaveBeenCalledWith(['/accueil'], { queryParams: { acces: 'refuse' } });
    expect(snackBarMock.open).toHaveBeenCalledWith('Droits insuffisants.', 'Fermer', {
      duration: 4000,
      panelClass: 'snackbar-error'
    });
  });
});
