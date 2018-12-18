import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendPeriodFilterComponent } from './trend-period-filter.component';

describe('TrendPeriodFilterComponent', () => {
  let component: TrendPeriodFilterComponent;
  let fixture: ComponentFixture<TrendPeriodFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendPeriodFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendPeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
