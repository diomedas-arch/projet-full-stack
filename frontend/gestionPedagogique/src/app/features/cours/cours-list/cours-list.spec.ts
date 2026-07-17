import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { CoursList } from './cours-list';

const CLE_TOKEN = 'gestion-pedagogique.auth-token';

function construireFauxJwt(role: string): string {
  const payload = btoa(JSON.stringify({ role }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${payload}.signature`;
}

async function creerComposant(role: string): Promise<{
  fixture: ComponentFixture<CoursList>;
  component: CoursList;
  httpMock: HttpTestingController;
}> {
  localStorage.setItem(CLE_TOKEN, construireFauxJwt(role));

  await TestBed.configureTestingModule({
    imports: [CoursList],
    providers: [
      provideHttpClient(withInterceptors([apiErrorInterceptor])),
      provideHttpClientTesting(),
      provideRouter([])
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(CoursList);
  const component = fixture.componentInstance;
  const httpMock = TestBed.inject(HttpTestingController);

  fixture.detectChanges();
  httpMock.expectOne('/api/cours').flush([{ idCours: 5, code: 'ANG101', titre: 'Angular avancé' }]);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component, httpMock };
}

describe('CoursList', () => {
  afterEach(() => {
    localStorage.removeItem(CLE_TOKEN);
  });

  describe("avec ROLE_REFERENTE (droit d'écriture)", () => {
    it('should create', async () => {
      const { component } = await creerComposant('ROLE_REFERENTE');
      expect(component).toBeTruthy();
    });

    it('affiche le bouton "Nouveau cours" et les actions modifier/supprimer', async () => {
      const { fixture } = await creerComposant('ROLE_REFERENTE');
      expect(fixture.nativeElement.textContent).toContain('Nouveau cours');
      expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('button[aria-label="Supprimer"]')).toBeTruthy();
    });

    it("construit le lien de modification avec l'idCours réel, pas undefined", async () => {
      const { fixture } = await creerComposant('ROLE_REFERENTE');
      const lien = fixture.nativeElement.querySelector('a[aria-label="Modifier"]') as HTMLAnchorElement;
      expect(lien.getAttribute('href')).toBe('/cours/5/modifier');
    });

    it("envoie l'idCours réel au DELETE, pas NaN/undefined", async () => {
      const { component, httpMock } = await creerComposant('ROLE_REFERENTE');
      spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
        afterClosed: () => of(true)
      } as never);

      component['supprimer'](component['cours']()[0]);

      const requete = httpMock.expectOne('/api/cours/5');
      expect(requete.request.method).toBe('DELETE');
      requete.flush(null, { status: 204, statusText: 'No Content' });

      httpMock.expectOne('/api/cours').flush([]);
    });
  });

  describe("avec un rôle sans droit d'écriture (ex: ROLE_ELEVE)", () => {
    it('masque le bouton "Nouveau cours"', async () => {
      const { fixture } = await creerComposant('ROLE_ELEVE');
      expect(fixture.nativeElement.textContent).not.toContain('Nouveau cours');
    });

    it('masque entièrement la colonne Actions, pas seulement les icônes', async () => {
      const { fixture } = await creerComposant('ROLE_ELEVE');
      expect(fixture.nativeElement.querySelector('a[aria-label="Modifier"]')).toBeNull();
      expect(fixture.nativeElement.querySelector('button[aria-label="Supprimer"]')).toBeNull();
      expect(fixture.nativeElement.querySelector('.actions-header')).toBeNull();
    });

    it('affiche quand même le tableau en lecture (code/titre visibles)', async () => {
      const { fixture } = await creerComposant('ROLE_ELEVE');
      expect(fixture.nativeElement.textContent).toContain('ANG101');
      expect(fixture.nativeElement.textContent).toContain('Angular avancé');
    });
  });
});
