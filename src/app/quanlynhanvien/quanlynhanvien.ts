import { Component, signal } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { Api } from '../services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { start } from 'node:repl';

@Component({
  imports: [NzTableComponent, NzTableModule, NzDividerModule, CommonModule, NzPaginationComponent],
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
  listOfData = signal<UserResponse[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
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
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
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
      if (res.status === 'SUCCESS') {
        this.listOfData.set(res.data.data);
        this.pageIndex.set(res.data.pageIndex);
        this.pageSize.set(res.data.pageSize);
        this.totalRecords.set(res.data.totalRecords);
      } else {
      }
    });
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    console.log(this.pageIndex());
    this.SearchUser();
  }

  ChangePageSize(pageSize:number){
    this.pageSize.set(pageSize);
    console.log(this.pageSize());
    this.SearchUser();
  };
}
