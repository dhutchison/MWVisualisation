import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTrendComponent } from './income-trend.component';

describe('IncomeTrendComponent', () => {
  let component: IncomeTrendComponent;
  let fixture: ComponentFixture<IncomeTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
