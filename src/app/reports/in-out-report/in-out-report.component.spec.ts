import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutReportComponent } from './in-out-report.component';

describe('InOutReportComponent', () => {
  let component: InOutReportComponent;
  let fixture: ComponentFixture<InOutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InOutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
