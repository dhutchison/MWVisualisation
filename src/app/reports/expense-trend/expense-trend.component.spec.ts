import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTrendComponent } from './expense-trend.component';

describe('ExpenseTrendComponent', () => {
  let component: ExpenseTrendComponent;
  let fixture: ComponentFixture<ExpenseTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
