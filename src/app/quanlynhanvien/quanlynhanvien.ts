import { Component, signal } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { Api } from '../services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [NzTableComponent, NzTableModule, NzDividerModule, CommonModule],
  selector: 'app-quanlynhanvien',
  styleUrl: './quanlynhanvien.scss',
  templateUrl: './quanlynhanvien.html',
})
export class Quanlynhanvien {
  constructor(
    private api: Api,
    private formBuilder: FormBuilder,
  ) {}
  SearchForm!: FormGroup;
  readonly listOfData = signal<UserResponse[]>([]);
  pageIndex = 1;
  pageSize = 10;
  ngOnInit(): void {
    this.SearchForm = this.formBuilder.group({
      fullName: [''],
      userName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      gender: [''],
      status: [''],
      phongBan: [''],
    });
    this.SearchUser();
  }

  SearchUser() {
    var request = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      fullName: this.SearchForm.controls['fullName'].value,
      userName: this.SearchForm.controls['userName'].value,
      email: this.SearchForm.controls['email'].value,
      phoneNumber: this.SearchForm.controls['phoneNumber'].value,
      address: this.SearchForm.controls['address'].value,
      gender: this.SearchForm.controls['gender'].value,
      status: this.SearchForm.controls['status'].value,
      phongBan: this.SearchForm.controls['phongBan'].value,
    };
    this.api.SearchUser(request).subscribe((res: any) => {
      this.listOfData.set(res.data.data);
    });
  }
}
