import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportLeave } from './report-leave';

describe('ReportLeave', () => {
  let component: ReportLeave;
  let fixture: ComponentFixture<ReportLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLeave],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportLeave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
