import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CursusService } from '../../../core/services/cursus.service';
import { commonComponentProviders } from '../../../testing/test-providers';
import { PromotionService } from '../promotion.service';
import { PromotionForm } from './promotion-form';

describe('PromotionForm', () => {
  let component: PromotionForm;
  let fixture: ComponentFixture<PromotionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionForm],
      providers: commonComponentProviders([
        {
          provide: PromotionService,
          useValue: {
            consulter: () => of({
              id: 1,
              idCursus: 1,
              libelle: 'Promotion test',
              periode: '2026',
              statut: 'PLANIFIEE'
            }),
            creer: () => of({}),
            modifier: () => of({})
          }
        },
        {
          provide: CursusService,
          useValue: {
            lister: () => of([])
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
