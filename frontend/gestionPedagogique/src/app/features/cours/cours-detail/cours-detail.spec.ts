import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { CoursService } from '../cours.service';
import { CoursDetail } from './cours-detail';

describe('CoursDetail', () => {
  let component: CoursDetail;
  let fixture: ComponentFixture<CoursDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursDetail],
      providers: commonComponentProviders([
        {
          provide: CoursService,
          useValue: {
            consulter: () => of({ id: 1, code: 'ANG', titre: 'Angular' })
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(CoursDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
