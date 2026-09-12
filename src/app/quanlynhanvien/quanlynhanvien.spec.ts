import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Quanlynhanvien } from './quanlynhanvien';

describe('Quanlynhanvien', () => {
  let component: Quanlynhanvien;
  let fixture: ComponentFixture<Quanlynhanvien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quanlynhanvien],
    }).compileComponents();

    fixture = TestBed.createComponent(Quanlynhanvien);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
