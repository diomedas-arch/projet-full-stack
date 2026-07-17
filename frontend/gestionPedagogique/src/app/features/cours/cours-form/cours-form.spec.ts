import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { CoursForm } from './cours-form';

describe('CoursForm', () => {
  let component: CoursForm;
  let fixture: ComponentFixture<CoursForm>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursForm],
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.verify();
    expect(component).toBeTruthy();
  });

  it('pre-remplit le formulaire quand un id est fourni', async () => {
    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();
    await fixture.whenStable();

    const requetes = httpMock.match('/api/cours/5');
    expect(requetes.length).toBe(1);
    requetes[0].flush({ idCours: 5, code: 'ANG101', titre: 'Angular avancé' });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['form'].getRawValue()).toEqual({ code: 'ANG101', titre: 'Angular avancé' });

    const inputCode = fixture.nativeElement.querySelector(
      'input[formcontrolname="code"]'
    ) as HTMLInputElement;
    expect(inputCode.value).toBe('ANG101');

    httpMock.verify();
  });

  it("affiche une erreur si le chargement de l'entité échoue", async () => {
    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();
    await fixture.whenStable();

    const requetes = httpMock.match('/api/cours/5');
    requetes[0].flush(
      { message: "Vous n'avez pas les droits nécessaires." },
      { status: 403, statusText: 'Forbidden' }
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['chargementErreur']()).toContain("Vous n'avez pas les droits");

    httpMock.verify();
  });
});
