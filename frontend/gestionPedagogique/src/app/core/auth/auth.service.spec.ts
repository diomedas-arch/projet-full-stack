import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService, decoderPayloadJwt, tokenExpire } from './auth.service';

describe('AuthService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('décode un payload JWT Base64URL sans padding', () => {
    const token = ['e30', 'eyJleHAiOjQ3MjU1NjQ4MDAsInN1YiI6InRlc3RAZXhhbXBsZS5jb20ifQ', 'sig'].join('.');

    expect(decoderPayloadJwt(token)).toEqual({
      exp: 4725564800,
      sub: 'test@example.com'
    });
    expect(tokenExpire(token, 1_000)).toBeFalse();
  });

  it('nettoie la session quand le token est expiré', () => {
    const token = ['e30', 'eyJleHAiOjEsInN1YiI6InRlc3RAZXhhbXBsZS5jb20ifQ', 'sig'].join('.');
    localStorage.setItem('token', token);
    localStorage.setItem(
      'utilisateur',
      JSON.stringify({ idUtilisateur: 1, email: 'test@example.com', role: 'ROLE_ADMIN', statut: 'ACTIF' })
    );

    const service = TestBed.inject(AuthService);

    expect(service.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('utilisateur')).toBeNull();
  });

  it('stocke la session après connexion', () => {
    const service = TestBed.inject(AuthService);
    service.login('admin@example.com', 'motdepasse').subscribe();

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@example.com', motDePasse: 'motdepasse' });
    req.flush({
      token: 'header.payload.signature',
      type: 'Bearer',
      expirationSecondes: 3600,
      utilisateur: { idUtilisateur: 1, email: 'admin@example.com', role: 'ROLE_ADMIN', statut: 'ACTIF' }
    });

    expect(localStorage.getItem('token')).toBe('header.payload.signature');
    expect(service.estConnecte()).toBeTrue();
  });
});
