import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { PromotionService } from '../promotion.service';
import { PromotionDetail } from './promotion-detail';

describe('PromotionDetail', () => {
  let component: PromotionDetail;
  let fixture: ComponentFixture<PromotionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionDetail],
      providers: commonComponentProviders([
        {
          provide: PromotionService,
          useValue: {
            consulterDetail: () => of(null)
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
