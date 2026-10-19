import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hisdaily } from './hisdaily';

describe('Hisdaily', () => {
  let component: Hisdaily;
  let fixture: ComponentFixture<Hisdaily>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hisdaily],
    }).compileComponents();

    fixture = TestBed.createComponent(Hisdaily);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
