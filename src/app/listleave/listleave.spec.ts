import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listleave } from './listleave';

describe('Listleave', () => {
  let component: Listleave;
  let fixture: ComponentFixture<Listleave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listleave],
    }).compileComponents();

    fixture = TestBed.createComponent(Listleave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
