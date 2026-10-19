import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dailycheck } from './dailycheck';

describe('Dailycheck', () => {
  let component: Dailycheck;
  let fixture: ComponentFixture<Dailycheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dailycheck],
    }).compileComponents();

    fixture = TestBed.createComponent(Dailycheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
