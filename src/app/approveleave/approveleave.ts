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


@Component({
  imports: [CommonModule, NzButtonModule, NzModalModule, NzSkeletonModule,
    NzTagModule, NzCardModule, NzStepsModule, NzTimelineComponent,
    NzTimelineItemComponent, NzPopconfirmModule, NzPaginationModule],
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
  itemLeave = signal<any>(null);
  isLoading = signal(true);
  selectedStatus = signal("PENDING");
  constructor(private api: Api, private authService: AuthService, private router: Router,
    private message: NzMessageService
  ) {

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

  reject(item: any) {

  }

  approve(item: any) {

  }

  ViewDetail(code: string) {
    this.isVisible.set(true);
    this.isLoading.set(true)
    this.api.GetLeaveItem(code).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (res) => {
        this.itemLeave.set(res.data);
      }, error: (err) => {
        this.message.create("error", "Lỗi " + err.message);
      }
    })
  }
  handleCancel() {
    this.isVisible.set(false);
  }

  cancelApprove(code: string): void {

  }

  confirmApprove(code: string): void {

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
