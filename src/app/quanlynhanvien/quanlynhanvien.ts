import { Component, signal } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UserResponse } from '../../model/Responsemodel/UserResponse';
import { Api } from '../services/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconDirective, NzIconService } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { BookOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RoleResponse } from '../../model/Responsemodel/RoleResponse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DepartmentResponse } from '../../model/Responsemodel/DepartmentResponse';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


@Component({
  imports: [
    NzTableComponent,
    NzTableModule,
    NzDividerModule,
    CommonModule,
    NzPaginationComponent,
    NzInputDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzIconDirective,
    NzFormControlComponent,
    NzInputWrapperComponent,
    ReactiveFormsModule,
    FormsModule,
    NzButtonComponent,
    NzPopconfirmDirective,
    NzPopconfirmModule,
    NzIconModule,
    NzModalModule,
    NzGridModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzRadioModule,
    NzSwitchModule
],
  selector: 'app-quanlynhanvien',
  styleUrl: './quanlynhanvien.scss',
  templateUrl: './quanlynhanvien.html',
})
export class Quanlynhanvien {
  constructor(
    private api: Api,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private iconService: NzIconService,
  ) {
    this.iconService.addIcon(BookOutline);
  }
  SearchForm!: FormGroup;
  UpdateForm!: FormGroup;
  listOfData = signal<UserResponse[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  readonly isVisible = signal(false);
  lstRole: RoleResponse[] = [];
  lstPhongBan = signal<DepartmentResponse[]>([]);
  
  ngOnInit(): void {
    this.SearchForm = this.formBuilder.group({
      fullName: [''],
      userName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      gender: [''],
      status: [true],
      phongBan: [''],
    });

    this.UpdateForm = this.formBuilder.group({
      id: ['',[Validators.required]],
      fullName: ['',[Validators.required]],
      userName: ['',[Validators.required]],
      email: ['',[Validators.required]],
      phoneNumber: ['',[Validators.required]],
      address: ['',[Validators.required]],
      avatar: [''],
      dateOfBirth: ['',[Validators.required]],
      gender: ['',[Validators.required]],
      cccd: ['',[Validators.required]],
      roleLevel: ['',[Validators.required]],
      phongBan: ['',[Validators.required]],
      trangThai: ['',[Validators.required]],
    });
    this.SearchUser();
    this.GetDSRole();
    this.GetPhongBan();
  }

  GetDSRole(){
    this.api.GetRole().subscribe(res=>{
      if(res.status = "SUCCESS"){
        this.lstRole = res.listData;
      }else{
        this.message.create(res.status.toLowerCase(), res.message);
        this.lstRole = [];
      }
    })
  }

  GetPhongBan(){
    this.api.GetPhongBan().subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.lstPhongBan.set(res.listData);
        console.log(this.lstPhongBan());
      }else{
        this.lstPhongBan.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
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
        this.message.error(res.message);
      }
    });
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.SearchUser();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.SearchUser();
  }

  confirmDelete(id: number) {
    console.log(id);
    this.api.DeleteUser(id).subscribe((res:any)=>{
      if (res.status === 'SUCCESS') {
        this.message.success(res.message);
        this.SearchUser();
      }else {
        this.message.error(res.message);
      }
    })
  }

  cancelDelete() {}

  openModalConfigUser(data: UserResponse){
    this.isVisible.set(true);
    this.UpdateForm.patchValue({
      id: data.id,
      fullName: data.fullName,
      userName: data.userName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      avatar: data.avatar,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      cccd: data.cccd,
      roleLevel: data.roleLevel,
      phongBan: data.phongBan,
      trangThai: data.status
    });
  }

  handleCancel(){
    this.isVisible.set(false);
  }

  submitForm(){
    console.log(this.UpdateForm.value);
    if (this.UpdateForm.valid) {

      this.UpdateForm.get('dateOfBirth')?.setValue(
        new Date(this.UpdateForm.get('dateOfBirth')?.value)
          .toISOString()
          .split('T')[0]
      );

      this.api.UpdateUser(this.UpdateForm.value).subscribe(res=>{
        if(res.status == "SUCCESS"){
          this.message.create(res.status.toLowerCase(), res.message);
          this.isVisible.set(false);
          this.SearchUser();
        }else{
          this.message.create(res.status.toLowerCase(), res.message);
        }
      })
    } else {
      Object.values(this.UpdateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  changeTrangThai(checked: any): void {
    console.log('Trạng thái:', checked);
  }
}
