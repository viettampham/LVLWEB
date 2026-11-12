import { Component, OnInit, signal } from '@angular/core';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTimelineComponent, NzTimelineItemComponent } from 'ng-zorro-antd/timeline';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';


@Component({
  imports: [CommonModule, NzTagModule, NzPaginationModule, NzFormModule, NzDatePickerModule, ReactiveFormsModule, NzButtonModule, NzBadgeModule, NzEmptyModule, NzCardModule, NzTimelineComponent, NzTimelineItemComponent, NzStepsModule, NzSkeletonModule, NzModalModule],
  selector: 'app-listleave',
  styleUrl: './listleave.scss',
  templateUrl: './listleave.html',
})
export class Listleave implements OnInit {
  LstData = signal<any[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  searchForm: FormGroup;
  CurentUser: any;
  statusDone = signal("ALL");
  itemLeave = signal<any>(null);
  isVisible = signal(false);
  isLoading = signal(true);

  constructor(private api: Api, private message: NzMessageService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.searchForm = this.fb.group({
      fromDate: [firstDayOfMonth, [Validators.required]],
      toDate: [today, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.CurentUser = this.authService.getCurrentUser();
      this.handleGetPaging();
    } else {
      this.router.navigate(['']);
    }

  }

  handleGetPaging() {
    var req = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      codeUser: this.CurentUser.CodeUser,
      fromDate: this.searchForm.controls['fromDate'].value,
      toDate: this.searchForm.controls['toDate'].value,
      statusDone: this.statusDone()
    };
    this.api.GetDsLeavePaging(req).subscribe({
      next: (res) => {
        this.LstData.set(res.data.data);
        this.totalRecords.set(res.data.totalRecords);
        console.log(this.LstData());
      },
      error: (err) => {
        this.message.create("error", err.message);
      }
    })
  }

  onchangeStatusSearch(status: string) {
    this.statusDone.set(status);
    this.handleGetPaging();
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.handleGetPaging();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.handleGetPaging();
  }
  showDetail(code: string) {
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

  PhatHanhDon(code: string) {
    this.api.PhatHanhDon(code).subscribe({
      next: (res) => {
        this.message.create(res.status.toLowerCase(), res.message);
        this.itemLeave.set(res.data);
      },
      error: (err) => {
        this.message.create("error", err.message);
      }
    })
  }


}
