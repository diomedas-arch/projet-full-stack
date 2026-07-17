import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { PromotionList } from './promotion-list';

const CLE_TOKEN = 'gestion-pedagogique.auth-token';

function construireFauxJwt(role: string): string {
  const payload = btoa(JSON.stringify({ role }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${payload}.signature`;
}

async function creerComposant(role: string): Promise<ComponentFixture<PromotionList>> {
  localStorage.setItem(CLE_TOKEN, construireFauxJwt(role));

  await TestBed.configureTestingModule({
    imports: [PromotionList],
    providers: [
      provideHttpClient(withInterceptors([apiErrorInterceptor])),
      provideHttpClientTesting(),
      provideRouter([])
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(PromotionList);
  fixture.detectChanges();
  TestBed.inject(HttpTestingController)
    .expectOne('/api/promotions')
    .flush([
      { idPromotion: 1, libelle: 'Promo A', periode: '2026', statut: 'PLANIFIEE', idCursus: 1, titreCursus: 'Dev' }
    ]);
  fixture.detectChanges();
  await fixture.whenStable();

  return fixture;
}

describe('PromotionList', () => {
  afterEach(() => {
    localStorage.removeItem(CLE_TOKEN);
  });

  it('should create', async () => {
    const fixture = await creerComposant('ROLE_REFERENTE');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche "Nouvelle promotion" et les actions avec ROLE_REFERENTE', async () => {
    const fixture = await creerComposant('ROLE_REFERENTE');
    expect(fixture.nativeElement.textContent).toContain('Nouvelle promotion');
    expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeTruthy();
  });

  it("masque \"Nouvelle promotion\" et la colonne Actions sans droit d'écriture (ex: ROLE_FORMATEUR)", async () => {
    const fixture = await creerComposant('ROLE_FORMATEUR');
    expect(fixture.nativeElement.textContent).not.toContain('Nouvelle promotion');
    expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.actions-header')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Promo A');
  });
});
