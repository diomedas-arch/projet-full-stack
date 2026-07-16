import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UtilisateurService } from './utilisateur.service';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UtilisateurService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envoie le mot de passe fourni à la création sans valeur par défaut', () => {
    service.creer({ email: 'u@example.com', motDePasse: 'secret123', role: 'ROLE_ADMIN', statut: 'ACTIF' }).subscribe();

    const req = http.expectOne('/api/utilisateurs');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.motDePasse).toBe('secret123');
    req.flush({ idUtilisateur: 1, email: 'u@example.com', role: 'ROLE_ADMIN', statut: 'ACTIF' });
  });

  it('appelle le PATCH de changement de mot de passe', () => {
    service.changerMotDePasse(3, 'nouveau123').subscribe();

    const req = http.expectOne('/api/utilisateurs/3/mot-de-passe');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ motDePasse: 'nouveau123' });
    req.flush({ idUtilisateur: 3, email: 'u@example.com', role: 'ROLE_ADMIN', statut: 'ACTIF' });
  });
});
