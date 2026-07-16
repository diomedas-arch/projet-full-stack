import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CursusCoursService } from '../../../core/services/cursus-cours.service';
import { FormateurService } from '../../../core/services/formateur.service';
import { commonComponentProviders } from '../../../testing/test-providers';
import { PromotionService } from '../../promotions/promotion.service';
import { CoursPlanifieService } from '../cours-planifie.service';
import { CoursPlanifieForm } from './cours-planifie-form';

describe('CoursPlanifieForm', () => {
  let component: CoursPlanifieForm;
  let fixture: ComponentFixture<CoursPlanifieForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursPlanifieForm],
      providers: commonComponentProviders([
        {
          provide: CoursPlanifieService,
          useValue: {
            consulter: () => of(null),
            creer: () => of({}),
            modifier: () => of({})
          }
        },
        {
          provide: PromotionService,
          useValue: {
            lister: () => of([])
          }
        },
        {
          provide: CursusCoursService,
          useValue: {
            listerParCursus: () => of([])
          }
        },
        {
          provide: FormateurService,
          useValue: {
            lister: () => of([])
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(CoursPlanifieForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
