import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetail } from './promotion-detail';

describe('PromotionDetail', () => {
  let component: PromotionDetail;
  let fixture: ComponentFixture<PromotionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
