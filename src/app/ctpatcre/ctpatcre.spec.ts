import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ctpatcre } from './ctpatcre';

describe('Ctpatcre', () => {
  let component: Ctpatcre;
  let fixture: ComponentFixture<Ctpatcre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ctpatcre],
    }).compileComponents();

    fixture = TestBed.createComponent(Ctpatcre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
