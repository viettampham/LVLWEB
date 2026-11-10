import { Component, OnInit, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineItemComponent, NzTimelineComponent } from 'ng-zorro-antd/timeline';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { sign } from 'node:crypto';

@Component({
  imports: [NzTabsModule, NzIconModule, NzSelectModule,
    NzDatePickerModule, NzCardModule, NzInputModule,
    NzButtonModule, CommonModule, ReactiveFormsModule, NzSkeletonModule,
    NzFormModule, NzResultModule, NzTagModule, NzModalModule, NzStepsModule, NzTimelineItemComponent, NzTimelineComponent],
  selector: 'app-dangkynghiphep',
  styleUrl: './dangkynghiphep.scss',
  templateUrl: './dangkynghiphep.html',
})
export class Dangkynghiphep implements OnInit {
  CurrentUser: any = null;
  DsTypeLeave = signal<any[]>([]);
  FormRegisLeave: FormGroup;
  FormLeave: FormGroup;
  leaveShift = signal(false);
  isPhatHanh = signal(false);
  readonly loadings = signal<boolean[]>([false, false]);
  readonly isVisible = signal(false);
  leaveItem = signal<any>(null);
  currentStep = signal(0);
  isLoading = signal(true);
  ListPendingAsignee = signal<any[]>([]);

  constructor(private authService: AuthService,
    private router: Router,
    private api: Api,
    private message: NzMessageService,
    private fb: FormBuilder) {
    var today = new Date();
    this.FormRegisLeave = this.fb.group({
      leaveType: ['', Validators.required],
      typeShift: ['', Validators.required],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
      totalDay: [0, Validators.required],
      reason: ['', Validators.required],
      pendingAsignee: ['', Validators.required],
    })
    this.FormLeave = this.fb.group({
      leaveType: ['', Validators.required],
      typeShift: ['', Validators.required],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
      totalDay: [0, Validators.required],
      reason: ['', Validators.required],
    })
  }

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.CurrentUser = user;
      this.GetLeaveType();
    } else {
      this.router.navigate(['']);
    }

    this.calculateDays();

    this.FormRegisLeave.get('fromDate')?.valueChanges.subscribe((fromDate) => {
      const toDate = this.FormRegisLeave.get('toDate')?.value;
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        // Nếu từ ngày mới > đến ngày cũ thì clear đến ngày
        if (from > to) {
          this.FormRegisLeave.patchValue({
            toDate: null,
            totalDay: 0
          });
        }
      }
      this.calculateDays();
    });

    this.FormRegisLeave.get('toDate')?.valueChanges.subscribe(() => {
      this.calculateDays();
    });


    this.FormRegisLeave.get('typeShift')?.valueChanges.subscribe(value => {
      this.onShiftChange(value);
    });
    this.GetpendingAsignee();
  }

  handleGetLeaveItem(code: string) {
    this.isLoading.set(true);
    this.api.GetLeaveItem(code).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (res) => {
        this.leaveItem.set(res.data);
      }, error: (err) => {
        this.message.create("error", "Lỗi " + err.message);
      }
    })
  }

  onShiftChange(value: string) {
    if (value === 'Nghỉ buổi sáng' || value === 'Nghỉ buổi chiều') {
      this.leaveShift.set(false);
      this.FormRegisLeave.patchValue({
        totalDay: 0.5,
        toDate: this.FormRegisLeave.get('fromDate')?.value
      });

    } else if (value === 'Nghỉ cả ngày') {
      this.leaveShift.set(false);
      this.FormRegisLeave.patchValue({
        totalDay: 1,
        toDate: this.FormRegisLeave.get('fromDate')?.value
      });
    } else if (value === 'Nghỉ dài ngày') {
      this.leaveShift.set(true);
      this.calculateDays();
    }
  }

  resetForm() {
    var today = new Date;
    this.FormRegisLeave.patchValue({
      leaveType: "",
      typeShift: "",
      fromDate: today,
      toDate: today,
      totalDay: 1,
      reason: "",
    });
  }

  calculateDays() {
    const shift = this.FormRegisLeave.get('typeShift')?.value;
    if (
      shift === 'Nghỉ buổi sáng' ||
      shift === 'Nghỉ buổi chiều'
    ) {
      this.FormRegisLeave.patchValue(
        {
          totalDay: 0.5,
        },
        {
          emitEvent: false
        }
      );

      return;
    }

    const fromDate = this.FormRegisLeave.get('fromDate')?.value;
    const toDate = this.FormRegisLeave.get('toDate')?.value;

    if (!fromDate || !toDate) {
      this.FormRegisLeave.patchValue(
        {
          totalDay: 0
        },
        {
          emitEvent: false
        }
      );
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const diff =
      Math.floor(
        (to.getTime() - from.getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1;

    this.FormRegisLeave.patchValue(
      {
        totalDay: diff > 0 ? diff : 0
      },
      {
        emitEvent: false
      }
    );
  }

  disabledFromDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return current < today;
  };

  disabledToDate = (current: Date): boolean => {
    const fromDate = this.FormRegisLeave.get('fromDate')?.value;

    if (!fromDate) {
      return false;
    }

    return current.getTime() <
      new Date(fromDate).setHours(0, 0, 0, 0);
  };


  handleRegisleave(index: number) {
    if (this.FormRegisLeave.valid) {
      this.loadings.update(loadings =>
        loadings.map((item, i) => i === index)
      );
      var request = {
        codeUser: this.CurrentUser.CodeUser,
        userName: this.CurrentUser.UserName,
        fullName: this.CurrentUser.Fullname,
        leaveType: this.FormRegisLeave.get('leaveType')?.value,
        typeShift: this.FormRegisLeave.get('typeShift')?.value,
        fromDate: this.FormRegisLeave.get('fromDate')?.value,
        toDate: this.FormRegisLeave.get('toDate')?.value,
        totalDay: this.FormRegisLeave.get('totalDay')?.value,
        reason: this.FormRegisLeave.get('reason')?.value,
        status: index === 0 ? "Đăng ký số" : "Phát hành",
        pendingAsigneeCode: this.FormRegisLeave.get('pendingAsignee')?.value
      }
      this.api.RegisLeave(request).pipe(finalize(() => {
        this.loadings.update(loadings =>
          loadings.map((item, i) => i === index ? false : item)
        );
      })).subscribe({
        next: (res) => {
          this.message.create(res.status.toLowerCase(), res.message);
          if (index == 0) {
            this.isPhatHanh.set(true);
            this.leaveItem.set(res.data);
            console.log("LeaveItem: ", this.leaveItem());
          }
          this.resetForm();
        }, error: (err) => {
          this.message.create("error", err.message);
        }
      })
    } else {
      Object.values(this.FormRegisLeave.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  GetLeaveType() {
    this.api.GetleaveType().subscribe({
      next: (res) => {
        this.DsTypeLeave.set(res.listData);
      }, error: (err) => {
        this.message.create("error", "Lỗi " + err.message);
      }
    })
  }


  onContinue() {
    this.isPhatHanh.set(false);
  }

  OnViewDetail() {
    this.isVisible.set(true);
    this.handleGetLeaveItem(this.leaveItem().code);
  }
  handleCancel() {
    this.isVisible.set(false);
  }

  handleSubmit(index: number) {

  }

  PhatHanhDon(code: string) {
    this.api.PhatHanhDon(code).subscribe({
      next: (res) => {
        this.message.create(res.status.toLowerCase(), res.message);
        this.leaveItem.set(res.data);
      },
      error: (err) => {
        this.message.create("error", err.message);
      }
    })
  }

  GetpendingAsignee(){
    if(this.leaveItem() == null){
      this.currentStep.set(0); 
    }else{
      this.currentStep.set(this.leaveItem().currentStep);
    }
    this.api.GetpendingAsignee(this.currentStep()).subscribe({
      next:(res)=>{
        this.ListPendingAsignee.set(res.listData);
        console.log(this.ListPendingAsignee());
      }, error: (err)=>{
        this.message.create("error", err.message);
      }
    })
  }

}
