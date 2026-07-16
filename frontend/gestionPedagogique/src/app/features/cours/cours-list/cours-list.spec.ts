import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { commonComponentProviders } from '../../../testing/test-providers';
import { CoursService } from '../cours.service';
import { CoursList } from './cours-list';

describe('CoursList', () => {
  let component: CoursList;
  let fixture: ComponentFixture<CoursList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursList],
      providers: commonComponentProviders([
        {
          provide: CoursService,
          useValue: {
            lister: () => of([]),
            supprimer: () => of(void 0)
          }
        }
      ])
    }).compileComponents();

    fixture = TestBed.createComponent(CoursList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
