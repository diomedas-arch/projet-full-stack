import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { CoursService } from '../cours.service';
import { CoursForm } from './cours-form';

describe('CoursForm', () => {
  let component: CoursForm;
  let fixture: ComponentFixture<CoursForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursForm],
      providers: commonComponentProviders([
        {
          provide: CoursService,
          useValue: {
            consulter: () => of({ id: 1, code: 'ANG', titre: 'Angular' }),
            creer: () => of({ id: 1, code: 'ANG', titre: 'Angular' }),
            modifier: () => of({ id: 1, code: 'ANG', titre: 'Angular' })
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(CoursForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
