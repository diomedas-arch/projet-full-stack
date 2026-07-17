import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { CoursPlanifieForm } from './cours-planifie-form';

function definirValeur(input: HTMLInputElement, valeur: string): void {
  input.value = valeur;
  input.dispatchEvent(new Event('input'));
}

describe('CoursPlanifieForm', () => {
  let component: CoursPlanifieForm;
  let fixture: ComponentFixture<CoursPlanifieForm>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursPlanifieForm],
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursPlanifieForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpMock
      .expectOne('/api/promotions')
      .flush([{ idPromotion: 10, idCursus: 1, titreCursus: 'Dev', libelle: 'Promo A', periode: '2026', statut: 'PLANIFIEE' }]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    httpMock.verify();
    expect(component).toBeTruthy();
  });

  it("saisit la date et l'heure via des inputs natifs mono-segment et envoie l'ISO combiné au backend", async () => {
    // Sélection promotion + cours du cursus (le select se filtre sur la promotion choisie)
    component['form'].controls.idPromotion.setValue(10);
    component['form'].controls.idCursusCours.setValue(1);
    fixture.detectChanges();

    // Simule une saisie clavier réelle dans les inputs date/heure natifs (pas de segment
    // "--:--" à débloquer : un <input type="date"> et un <input type="time"> ne sont que des
    // champs mono-valeur, ce que le navigateur sait toujours faire au clic/clavier).
    const inputDebutDate = fixture.nativeElement.querySelector(
      'input[formcontrolname="dateDebutDate"]'
    ) as HTMLInputElement;
    const inputDebutHeure = fixture.nativeElement.querySelector(
      'input[formcontrolname="dateDebutHeure"]'
    ) as HTMLInputElement;
    const inputFinDate = fixture.nativeElement.querySelector(
      'input[formcontrolname="dateFinDate"]'
    ) as HTMLInputElement;
    const inputFinHeure = fixture.nativeElement.querySelector(
      'input[formcontrolname="dateFinHeure"]'
    ) as HTMLInputElement;

    expect(inputDebutDate.type).toBe('date');
    expect(inputDebutHeure.type).toBe('time');

    definirValeur(inputDebutDate, '2026-09-01');
    definirValeur(inputDebutHeure, '09:00');
    definirValeur(inputFinDate, '2026-09-01');
    definirValeur(inputFinHeure, '11:00');
    fixture.detectChanges();

    expect(component['form'].controls.dateDebutHeure.value).toBe('09:00');

    component['enregistrer']();

    const requete = httpMock.expectOne('/api/cours-planifies');
    expect(requete.request.method).toBe('POST');
    expect(requete.request.body.dateDebut).toBe('2026-09-01T09:00');
    expect(requete.request.body.dateFin).toBe('2026-09-01T11:00');
    requete.flush({});
  });

  it("pré-remplit date et heure séparément en mode édition à partir de l'ISO renvoyé par le backend", async () => {
    fixture.componentRef.setInput('id', '7');
    fixture.detectChanges();
    await fixture.whenStable();

    const requete = httpMock.expectOne('/api/cours-planifies/7');
    requete.flush({
      idCoursPlanifie: 7,
      idPromotion: 10,
      libellePromotion: 'Promo A',
      idCursusCours: 1,
      titreCours: 'Algo',
      idFormateur: null,
      specialiteFormateur: null,
      dateDebut: '2026-09-01T09:00:00',
      dateFin: '2026-09-01T11:00:00',
      salle: 'B12',
      statut: 'PLANIFIE'
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['form'].controls.dateDebutDate.value).toBe('2026-09-01');
    expect(component['form'].controls.dateDebutHeure.value).toBe('09:00');
    expect(component['form'].controls.dateFinDate.value).toBe('2026-09-01');
    expect(component['form'].controls.dateFinHeure.value).toBe('11:00');

    const inputDebutHeure = fixture.nativeElement.querySelector(
      'input[formcontrolname="dateDebutHeure"]'
    ) as HTMLInputElement;
    expect(inputDebutHeure.value).toBe('09:00');

    httpMock.verify();
  });
});
