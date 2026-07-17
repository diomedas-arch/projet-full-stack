import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { CoursList } from './cours-list';

describe('CoursList', () => {
  let component: CoursList;
  let fixture: ComponentFixture<CoursList>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursList],
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpMock.expectOne('/api/cours').flush([{ idCours: 5, code: 'ANG101', titre: 'Angular avancé' }]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("construit le lien de modification avec l'idCours réel, pas undefined", () => {
    const lien = fixture.nativeElement.querySelector('a[aria-label="Modifier"]') as HTMLAnchorElement;
    expect(lien.getAttribute('href')).toBe('/cours/5/modifier');
  });

  it("envoie l'idCours réel au DELETE, pas NaN/undefined", () => {
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
