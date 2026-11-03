import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dangkynghiphep } from './dangkynghiphep';

describe('Dangkynghiphep', () => {
  let component: Dangkynghiphep;
  let fixture: ComponentFixture<Dangkynghiphep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dangkynghiphep],
    }).compileComponents();

    fixture = TestBed.createComponent(Dangkynghiphep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
