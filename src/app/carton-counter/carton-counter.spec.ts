import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartonCounter } from './carton-counter';

describe('CartonCounter', () => {
  let component: CartonCounter;
  let fixture: ComponentFixture<CartonCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartonCounter],
    }).compileComponents();

    fixture = TestBed.createComponent(CartonCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
