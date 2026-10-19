import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mobilecheck } from './mobilecheck';

describe('Mobilecheck', () => {
  let component: Mobilecheck;
  let fixture: ComponentFixture<Mobilecheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mobilecheck],
    }).compileComponents();

    fixture = TestBed.createComponent(Mobilecheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
