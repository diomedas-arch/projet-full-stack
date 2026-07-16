import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FormateurService } from './formateur.service';

describe('FormateurService', () => {
  let service: FormateurService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FormateurService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge les formateurs actifs depuis le backend', () => {
    service.lister({ actif: true }).subscribe((formateurs) => {
      expect(formateurs[0].email).toBe('formateur@example.com');
    });

    const req = http.expectOne('/api/formateurs?actif=true');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        idFormateur: 1,
        idUtilisateur: 4,
        email: 'formateur@example.com',
        specialite: 'Développement web',
        actif: true
      }
    ]);
  });
});
