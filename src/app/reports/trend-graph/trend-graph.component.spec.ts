import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendGraphComponent } from './trend-graph.component';

describe('TrendGraphComponent', () => {
  let component: TrendGraphComponent;
  let fixture: ComponentFixture<TrendGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
