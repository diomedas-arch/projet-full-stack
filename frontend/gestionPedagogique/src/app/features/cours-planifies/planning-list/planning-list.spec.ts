import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { CoursPlanifieService } from '../cours-planifie.service';
import { PlanningList } from './planning-list';

describe('PlanningList', () => {
  let component: PlanningList;
  let fixture: ComponentFixture<PlanningList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningList],
      providers: commonComponentProviders([
        {
          provide: CoursPlanifieService,
          useValue: {
            lister: () => of([]),
            supprimer: () => of(void 0)
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
