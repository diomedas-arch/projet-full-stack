import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EleveService } from './eleve.service';

describe('EleveService', () => {
  let service: EleveService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EleveService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envoie le mot de passe fourni à la création sans valeur par défaut', () => {
    service
      .creer({
        email: 'e@example.com',
        motDePasse: 'secret123',
        numeroDossier: 'ELV-1',
        telephone: null,
        statut: 'ACTIF'
      })
      .subscribe();

    const req = http.expectOne('/api/eleves');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.motDePasse).toBe('secret123');
    req.flush({
      idEleve: 1,
      idUtilisateur: 2,
      email: 'e@example.com',
      numeroDossier: 'ELV-1',
      telephone: null,
      statut: 'ACTIF'
    });
  });

  it('appelle le PATCH de changement de mot de passe', () => {
    service.changerMotDePasse(4, 'nouveau123').subscribe();

    const req = http.expectOne('/api/eleves/4/mot-de-passe');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ motDePasse: 'nouveau123' });
    req.flush({
      idEleve: 4,
      idUtilisateur: 5,
      email: 'e@example.com',
      numeroDossier: 'ELV-4',
      telephone: null,
      statut: 'ACTIF'
    });
  });
});
