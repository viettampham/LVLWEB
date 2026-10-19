import { Component,ElementRef,signal, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuditResponse } from '../../model/Responsemodel/AuditResponse';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { OperationStandardResponse } from '../../model/Responsemodel/OperationStandardResponse';
import { CommonModule } from '@angular/common';
import { DetechIssueResponse } from '../../model/Responsemodel/DetechIssueResponse';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  imports: [NzButtonModule,
    NzModalComponent,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule, 
    NzTableModule, 
    NzPaginationComponent, 
    NzDatePickerModule, 
    NzIconModule, 
    NzTabsModule, 
    CommonModule, 
    NzFloatButtonModule
  ],
  selector: 'app-dailycheck',
  styleUrl: './dailycheck.scss',
  templateUrl: './dailycheck.html',
})
export class Dailycheck {
  readonly isVisible = signal(false);
  readonly isShowModalDetail = signal(false);
  readonly isShowModalAssignee = signal(false);
  readonly isVisibleCam = signal(false);
  titleModalAssignee = signal("");
  validateForm: FormGroup;
  searchForm: FormGroup;
  formAssignee: FormGroup;
  CurrentUser: any = null;
  listOfData = signal<AuditResponse[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  lstOperationStandard = signal<OperationStandardResponse[]>([]);
  lstDetechIssue = signal<DetechIssueResponse[]>([]);
  lstAssignee = signal<any[]>([]);
  videoElement!: HTMLVideoElement;
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  capturedImage = '';


  constructor(private fb: FormBuilder, private router: Router, private api: Api, private message: NzMessageService, private cdr: ChangeDetectorRef) {
    this.validateForm = this.fb.group({
      location: ['', [Validators.required]],
      auditor: [
        { value: 'Admin', readonly: true },
        [Validators.required]
      ],
      note: [''],
    });
    
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.searchForm = this.fb.group({
      location: [''],
      auditor: [''],
      dateCreate: [[firstDayOfMonth, today]]
    });

    this.formAssignee = this.fb.group({
      evalue: ['', [Validators.required]],
      note: [''],
      duedate: [today, [Validators.required]],
      assignee: [''],
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
      this.validateForm.patchValue({
        auditor: this.CurrentUser.Fullname,
      });
    } else {
      this.router.navigate(['']);
    }
    console.log('CurrentUser', this.CurrentUser);
    this.SearchAudit();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.api.CreateAudit(this.validateForm.value).subscribe(res=>{
        if(res.status == "SUCCESS"){
          this.isVisible.set(false);
          this.validateForm.reset();
          this.message.create(res.status.toLowerCase(), res.message);
        }else{
          this.message.create(res.status.toLowerCase(), res.message);
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitFormAssignee(): void {
    console.log('submit', this.formAssignee.value); 
    if((this.formAssignee.controls['assignee'].value == null || this.formAssignee.controls['duedate'].value == null) && this.formAssignee.controls['evalue'].value == "NG"){
        this.message.create('error', 'Vui lòng chọn người phụ trách và thêm ngày hết hạn nếu đánh giá là NG');
        return;
      }
    if (this.formAssignee.valid) {
      var formData = new FormData();
      //formData.append('IdAudit', this.formAssignee.controls['evalue'].value);
      
    } else {
      Object.values(this.formAssignee.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  showModal(){
    this.isVisible.set(true);
    this.validateForm.patchValue({
      auditor: this.CurrentUser.Fullname,
    });
  }
  handleCancel(){
    this.isVisible.set(false);
  }

  handleCancelModalDetail(){
    this.isShowModalDetail.set(false);
  }
  handleCancelModalAssignee(){
    this.isShowModalAssignee.set(false);
  }
  handleOk(){
    this.isVisible.set(false);
  }

  confirmDelete(id: number): void {
    this.api.DeleteAudit(id).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.message.create(res.status.toLowerCase(), res.message);
        this.SearchAudit();
      }else{
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.SearchAudit();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.SearchAudit();
  }

  cancelDelete(){

  }

  SearchAudit(){
    const [from, to] = this.searchForm.value.dateCreate || [];
    var request = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      location: this.searchForm.controls['location'].value,
      auditor: this.searchForm.controls['auditor'].value,
      dateCreateFrom: from? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`: null,
      dateCreateTo: to? `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`: null
    }
    this.api.GetAudit(request).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.listOfData.set(res.data.data);
        this.pageIndex.set(res.data.pageIndex);
        this.pageSize.set(res.data.pageSize);
        this.totalRecords.set(res.data.totalRecords);
      }else{
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })    
  }

  ConvertDattimeDisplay(dateTimeString: string) {
    const date = new Date(dateTimeString);
    const result =
      String(date.getDate()).padStart(2, '0') + '/' +
      String(date.getMonth() + 1).padStart(2, '0') + '/' +
      date.getFullYear() + ' ' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0');

    return result;
  }

  ShowModalCheckAudit(id: any){
    this.isShowModalDetail.set(true);
    this.GetOperationStandard();
  }

  GetOperationStandard(){
    this.api.GetOperationStandard().subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.lstOperationStandard.set(res.listData);
      }else{
        this.lstOperationStandard.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  funcGetDetechIssue(id: number){
    this.api.GetDetechIssue(id).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.lstDetechIssue.set(res.listData);
      }else{
        this.lstDetechIssue.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  onTabChange(index: number) {
    const tab = this.lstOperationStandard()[index];
    this.funcGetDetechIssue(tab.id);
  }
  
  GetAssignee(){
    this.api.GetAssignee().subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.lstAssignee.set(res.listData);
      }else{
        this.lstAssignee.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  AsignTo(data: DetechIssueResponse){
    this.formAssignee.reset();
    this.formAssignee.patchValue({
      duedate: new Date(),
    });
    this.isShowModalAssignee.set(true);
    this.titleModalAssignee.set(data.detechIssue1);
    this.GetAssignee();
    this.capturedImage = '';
  }

  async openCamera() {
    try {
      this.isVisibleCam.set(true);
      this.cdr.detectChanges();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment'
          },
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        },
        audio: false
      });

      const video = this.videoRef.nativeElement;

      video.srcObject = stream;

      await video.play();

      console.log(
        'Camera settings:',
        stream.getVideoTracks()[0].getSettings()
      );

    } catch (e) {
      console.error('Không thể mở camera:', e);
    }
  }

  closeCamera() {
    const video = this.videoRef.nativeElement;
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    video.pause();
    video.srcObject = null;
    this.isVisibleCam.set(false);
  }
  captureImage() {
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Không lấy được context của canvas');
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.9);
    this.closeCamera();
  }
}
