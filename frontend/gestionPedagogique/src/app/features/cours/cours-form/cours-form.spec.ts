import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursForm } from './cours-form';

describe('CoursForm', () => {
  let component: CoursForm;
  let fixture: ComponentFixture<CoursForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
