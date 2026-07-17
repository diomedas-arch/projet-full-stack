import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { PlanningList } from './planning-list';

const CLE_TOKEN = 'gestion-pedagogique.auth-token';

function construireFauxJwt(role: string): string {
  const payload = btoa(JSON.stringify({ role }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${payload}.signature`;
}

async function creerComposant(role: string): Promise<ComponentFixture<PlanningList>> {
  localStorage.setItem(CLE_TOKEN, construireFauxJwt(role));

  await TestBed.configureTestingModule({
    imports: [PlanningList],
    providers: [
      provideHttpClient(withInterceptors([apiErrorInterceptor])),
      provideHttpClientTesting(),
      provideRouter([])
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(PlanningList);
  fixture.detectChanges();
  TestBed.inject(HttpTestingController)
    .expectOne('/api/cours-planifies')
    .flush([
      {
        idCoursPlanifie: 1,
        idPromotion: 1,
        libellePromotion: 'Promo A',
        idCursusCours: 1,
        titreCours: 'Algo',
        idFormateur: null,
        specialiteFormateur: null,
        dateDebut: '2026-09-01T09:00:00',
        dateFin: '2026-09-01T11:00:00',
        salle: 'B12',
        statut: 'PLANIFIE'
      }
    ]);
  fixture.detectChanges();
  await fixture.whenStable();

  return fixture;
}

describe('PlanningList', () => {
  afterEach(() => {
    localStorage.removeItem(CLE_TOKEN);
  });

  it('should create', async () => {
    const fixture = await creerComposant('ROLE_REFERENTE');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche "Nouveau cours planifié" et les actions avec ROLE_REFERENTE', async () => {
    const fixture = await creerComposant('ROLE_REFERENTE');
    expect(fixture.nativeElement.textContent).toContain('Nouveau cours planifié');
    expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeTruthy();
  });

  it("masque \"Nouveau cours planifié\" et la colonne Actions sans droit d'écriture (ex: ROLE_ELEVE)", async () => {
    const fixture = await creerComposant('ROLE_ELEVE');
    expect(fixture.nativeElement.textContent).not.toContain('Nouveau cours planifié');
    expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.actions-header')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Algo');
  });
});
