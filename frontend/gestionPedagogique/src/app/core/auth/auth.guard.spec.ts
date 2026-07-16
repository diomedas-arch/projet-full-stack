import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const authMock = {
    verifierSession: jasmine.createSpy('verifierSession'),
    aUnRole: jasmine.createSpy('aUnRole')
  };

  beforeEach(() => {
    authMock.verifierSession.calls.reset();
    authMock.aUnRole.calls.reset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }]
    });
  });

  it('redirige vers login avec returnUrl si la session est absente', () => {
    authMock.verifierSession.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({ data: {} } as any, { url: '/utilisateurs' } as any)
    ) as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login?returnUrl=%2Futilisateurs');
  });

  it('redirige vers accueil avec motif si le rôle est insuffisant', () => {
    authMock.verifierSession.and.returnValue(true);
    authMock.aUnRole.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({ data: { roles: ['ROLE_ADMIN'] } } as any, { url: '/utilisateurs' } as any)
    ) as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/accueil?acces=refuse');
  });

  it('autorise la route quand session et rôle sont valides', () => {
    authMock.verifierSession.and.returnValue(true);
    authMock.aUnRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({ data: { roles: ['ROLE_ADMIN'] } } as any, { url: '/utilisateurs' } as any)
    );

    expect(result).toBeTrue();
  });
});
