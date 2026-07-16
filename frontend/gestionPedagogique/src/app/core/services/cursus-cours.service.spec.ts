import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CursusCoursService } from './cursus-cours.service';

describe('CursusCoursService', () => {
  let service: CursusCoursService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CursusCoursService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge les cours du cursus depuis le backend', () => {
    service.listerParCursus(7).subscribe((cours) => {
      expect(cours[0].codeCours).toBe('ANG-101');
    });

    const req = http.expectOne('/api/cursus/7/cours');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        idCursusCours: 1,
        idCursus: 7,
        idCours: 2,
        codeCours: 'ANG-101',
        titreCours: 'Angular',
        ordre: 1,
        prerequis: null,
        obligatoire: true
      }
    ]);
  });
});
