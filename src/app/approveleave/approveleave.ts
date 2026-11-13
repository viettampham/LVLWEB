import { Component, OnInit, signal } from '@angular/core';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineComponent, NzTimelineItemComponent } from 'ng-zorro-antd/timeline';
import { finalize } from 'rxjs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, NzButtonModule, NzModalModule, NzSkeletonModule,
    NzTagModule, NzCardModule, NzStepsModule, NzTimelineComponent,
    NzTimelineItemComponent, NzPopconfirmModule, NzPaginationModule, NzIconModule, NzFormModule, NzInputModule,ReactiveFormsModule],
  selector: 'app-approveleave',
  styleUrl: './approveleave.scss',
  templateUrl: './approveleave.html',
})
export class Approveleave implements OnInit {
  listPending = signal<any>(null);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  CurentUser: any;
  isVisible = signal(false);
  isShowModalReject = signal(false);
  codeLeave = "";
  itemLeave = signal<any>(null);
  isLoading = signal(true);
  selectedStatus = signal("PENDING");
  formReject: FormGroup;
  isMobile = window.innerWidth < 576;

  constructor(private api: Api, private authService: AuthService, private router: Router,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.formReject = this.fb.group({
      reasonReject: ["",[Validators.required]] 
    })
  }
  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.CurentUser = this.authService.getCurrentUser();
      this.GetListPendingData();
    } else {
      this.router.navigate(['']);
    }
  }

  GetListPendingData() {
    var req = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      codePending: this.CurentUser.CodeUser,
      status: this.selectedStatus()
    }
    this.api.GetPendingCurrentStep(req).subscribe({
      next: (res) => {
        this.listPending.set(res.data.data);
        this.totalRecords.set(res.data.totalRecords);
      }, error: (err) => {
        this.message.create("error", err.message);
      }
    })
  }

  viewDetail(item: any) {

  }

  handleReject(code: string) {
    this.isShowModalReject.set(true);
    this.codeLeave = code;
    this.formReject.reset();
  }

  approve(item: any) {

  }

  ViewDetail(code: string) {
    this.isLoading.set(true)
    this.api.GetLeaveItem(code).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (res) => {
        this.itemLeave.set(res.data);
        this.isVisible.set(true);
      }, error: (err) => {
        this.message.create("error", "Lỗi " + err.message);
      }
    })
  }
  handleCancel() {
    this.isVisible.set(false);
  }

  handleCancelReject() {
    this.isShowModalReject.set(false);
  }

  rejectLeave(){
    if(this.formReject.valid){
      var req = {
        codeLeave: this.codeLeave,
        codeReject: this.CurentUser.CodeUser,
        reasonReject: this.formReject.controls["reasonReject"].value
      }
      this.api.RejectLeave(req).subscribe({
        next:(res)=>{
          this.itemLeave.set(res.data);
          this.GetListPendingData();
          this.message.create(res.status, res.message);
          this.isShowModalReject.set(false);
        },error: (err)=>{
          this.message.create("error", err.message);
        }
      })
    }else{
      Object.values(this.formReject.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelApprove(code: string): void {

  }

  confirmApprove(code: string): void {
    var req = {
      codeLeave: code,
      codeApprover: this.CurentUser.CodeUser
    }

    this.api.XacNhanDon(req).subscribe({
      next: (res)=>{
        this.message.create("success", "Xác nhận phê duyệt thành công");
        this.itemLeave.set(res.data);
        this.GetListPendingData();
      }, error: (err)=>{
        this.message.create("error", "Lỗi " + err.message);
      }
    })
  }


  changeStatus(status: string) {
    this.selectedStatus.set(status);
    this.GetListPendingData();
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.GetListPendingData();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.GetListPendingData();
  }


}
