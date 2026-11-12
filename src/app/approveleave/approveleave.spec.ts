import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Approveleave } from './approveleave';

describe('Approveleave', () => {
  let component: Approveleave;
  let fixture: ComponentFixture<Approveleave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Approveleave],
    }).compileComponents();

    fixture = TestBed.createComponent(Approveleave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
