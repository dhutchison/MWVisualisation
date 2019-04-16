import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetWorthTrendComponent } from './net-worth-trend.component';

describe('NetWorthTrendComponent', () => {
  let component: NetWorthTrendComponent;
  let fixture: ComponentFixture<NetWorthTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetWorthTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetWorthTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
