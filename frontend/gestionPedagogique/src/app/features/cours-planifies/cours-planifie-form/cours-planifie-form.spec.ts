import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursPlanifieForm } from './cours-planifie-form';

describe('CoursPlanifieForm', () => {
  let component: CoursPlanifieForm;
  let fixture: ComponentFixture<CoursPlanifieForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursPlanifieForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursPlanifieForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
