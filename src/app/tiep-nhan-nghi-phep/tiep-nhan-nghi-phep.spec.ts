import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiepNhanNghiPhep } from './tiep-nhan-nghi-phep';

describe('TiepNhanNghiPhep', () => {
  let component: TiepNhanNghiPhep;
  let fixture: ComponentFixture<TiepNhanNghiPhep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiepNhanNghiPhep],
    }).compileComponents();

    fixture = TestBed.createComponent(TiepNhanNghiPhep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
