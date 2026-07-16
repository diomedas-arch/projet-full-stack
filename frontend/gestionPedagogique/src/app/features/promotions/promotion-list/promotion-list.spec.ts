import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { PromotionService } from '../promotion.service';
import { PromotionList } from './promotion-list';

describe('PromotionList', () => {
  let component: PromotionList;
  let fixture: ComponentFixture<PromotionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionList],
      providers: commonComponentProviders([
        {
          provide: PromotionService,
          useValue: {
            lister: () => of([]),
            supprimer: () => of(void 0)
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
