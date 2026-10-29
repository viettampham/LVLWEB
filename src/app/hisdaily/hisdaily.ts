import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { AuditDetailResponse } from '../../model/Responsemodel/AuditDetailResponse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzUploadComponent } from 'ng-zorro-antd/upload';
import { FormsModule } from '@angular/forms';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';



@Component({
  imports: [NzTableModule, NzButtonModule, CommonModule, NzTagModule, NzIconModule, NzCheckboxModule, FormsModule,
    NzPaginationComponent, NzIconModule, NzFormModule, NzInputModule, ReactiveFormsModule, NzDatePickerModule, NzSelectModule, NzModalModule, NzTabsModule, NzUploadComponent, NzDropdownModule],
  selector: 'app-hisdaily',
  styleUrl: './hisdaily.scss',
  templateUrl: './hisdaily.html',
})
export class Hisdaily {
  listOfData = signal<AuditDetailResponse[]>([]);
  pageIndex = signal(1);
  pageIndex2 = signal(1);
  pageSize = signal(10);
  pageSize2 = signal(10);
  totalRecords = signal(0);
  searchForm: FormGroup;
  serchOwner: FormGroup;
  FormPhanCong: FormGroup;
  CurrentUser: any = null;
  readonly isVisible = signal(false); 
  readonly isVisiblePhanCong = signal(false); 
  selectedItem : any = null;
  iShowCard = signal(false);
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  private cameraStream: MediaStream | null = null;
  capturedImage = ''; 
  capturedImageAfter = ''; 
  isShowCam = signal(true); 
  idAuditDetail = 0;
  ActionPlan = '';
  lstAssignee = signal<any[]>([]);
  
  constructor(private fb: FormBuilder, private router: Router, private api: Api, private message: NzMessageService){
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.searchForm = this.fb.group({
      assignee: [''],
      status: ['Mới phát hiện'],
    });

    this.serchOwner = this.fb.group({
      owner: [''],
      status: ['Chưa phân công'],
    });

    this.FormPhanCong = this.fb.group({
      assignee: ['',Validators.required],
      duedate: [today,Validators.required]
    });

  }

  onStatusChange(checked: boolean) {
    this.searchForm.patchValue({
      status: checked ? "Đã hoàn thành" : "Phát hành"
    })
    this.SearchAuditDetail();
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
      this.searchForm.patchValue({
        assignee: this.CurrentUser.Fullname,
        status: "Phát hành"
      });
    } else {
      this.router.navigate(['']);
    }
    console.log('CurrentUser', this.CurrentUser);
    this.SearchAuditDetail();
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

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.SearchAuditDetail();
  }

  ChangePageIndex2(pageIndex: number) {
    this.pageIndex2.set(pageIndex);
    this.GetAuditDetailOwner();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.SearchAuditDetail();
  }

  ChangePageSize2(pageSize: number) {
    this.pageSize2.set(pageSize);
    this.SearchAuditDetail();
  }

  GetAuditDetailOwner(){
    var req = {
      pageIndex : this.pageIndex2(),
      pageSize: this.pageSize2(),
      owner: this.CurrentUser.Fullname,
      status: this.serchOwner.controls['status'].value,
    }
    this.api.GetAuditDetailOwner(req).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.listOfData.set(res.data.data);
        this.totalRecords.set(res.data.totalRecords);
      }else{
        this.listOfData.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  beforeUpload = (file: any): boolean => {
    const reader = new FileReader();

    reader.onload = () => {
      this.capturedImageAfter = reader.result as string;
      this.closeCamera();
    };

    reader.readAsDataURL(file);
    return false;
  };

  onTabChange(index: number) {
    if (index == 0) {
      this.SearchAuditDetail();
    }else if(index == 1){
      this.GetAuditDetailOwner();
    }
  }

  SearchAuditDetail(){
    var req = {
      pageIndex : this.pageIndex(),
      pageSize: this.pageSize(),
      assignee: this.searchForm.controls['assignee'].value,
      status: this.searchForm.controls['status'].value 
    }
    this.api.GetAuditDetail(req).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.listOfData.set(res.data.data);
        this.totalRecords.set(res.data.totalRecords);
      }else{
        this.listOfData.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  captureImage() {
    const video = this.videoRef.nativeElement;
    if (!video || !video.srcObject) {
      this.message.warning('Vui lòng mở camera trước');
      return;
    }
    if(video == null || video == undefined){
      this.message.create("warning","Vui lòng click mở camera");
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Không lấy được context của canvas');
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImageAfter = canvas.toDataURL('image/jpeg', 0.9);
    this.closeCamera();
    this.isShowCam.set(false);
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

  ConvertDate(dateTimeString: string) {
    if(dateTimeString == "" || dateTimeString == null){
      return "Chờ phân công";
    }

    const date = new Date(dateTimeString);
    const result =
      String(date.getDate()).padStart(2, '0') + '/' +
      String(date.getMonth() + 1).padStart(2, '0') + '/' +
      date.getFullYear()
      ;

    return result;
  }

  onOpenChange(open: boolean): void {
    if(open == false){
      this.SearchAuditDetail();
    }
  }

  onStatusChangePhanCong(checked: boolean){
    this.serchOwner.patchValue({
        status: checked ? "Đã phân công" : "Chưa phân công"
      });
    this.GetAuditDetailOwner();
  }

  DetailCheck(item: number){
    this.idAuditDetail = item;
    this.api.GetAuditDetailById(item).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.selectedItem = res.data;
        this.ActionPlan = res.data.actionPlan;
        if(res.data.imageAfter){
          this.isShowCam.set(false);
          this.capturedImageAfter = res.data.imageAfter;
        }else{
          this.isShowCam.set(true);
          this.capturedImageAfter = "";
        }
        this.iShowCard.set(true);

        if(this.selectedItem.status != "Mới phát hiện"){
          this.isVisible.set(true);
        }else{
          this.isVisiblePhanCong.set(true);
          this.GetAssignee();
          this.FormPhanCong.patchValue({
            assignee: res.data.assignee,
            duedate:res.data.dueDate
          });
        }
      }else{
        this.selectedItem = null;
        this.iShowCard.set(false);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    });
  }

  handleCancel(){
    this.isVisible.set(false);
    this.isVisiblePhanCong.set(false);
    this.iShowCard.set(false);
  }

   base64ToBlob(base64: string): Blob {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  submitForm(){
    if(this.CurrentUser.Fullname != this.selectedItem.assignee){
      this.message.create('error', "Bạn không phải người chịu trách nhiệm");
      return;
    }

    if(this.ActionPlan == null || this.ActionPlan == ""){
      this.message.create('error', "Vui lòng nhập thông tin kế hoạch khắc phục");
      return;
    }

    if(this.capturedImageAfter == null || this.capturedImageAfter == ""){
      this.message.create('error', "Vui lòng chụp ảnh sau khi khắc phục");
      return;
    }

    var formData = new FormData();
    const imageBlob = this.base64ToBlob(this.capturedImageAfter);


    formData.append('IdAuditDetail', this.idAuditDetail.toString());
    formData.append('ImageAfter', imageBlob);
    formData.append('ActionPlan', this.ActionPlan);

    this.api.AddImageAfterToAuditDetail(formData).subscribe(res=>{
      if(res.status = "SUCCESS"){
        this.isVisible.set(false);
        this.message.create(res.status.toLowerCase(), res.message);
        this.SearchAuditDetail();
      }else{
        this.message.create(res.status.toLowerCase(), res.message);
      }
    });
  }

  handlePhanCong(){
    if(!this.FormPhanCong.valid){
      this.message.create("error", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    var req = {
      idAuditDetail: this.idAuditDetail,
      asignee: this.FormPhanCong.controls["assignee"].value,
      dueDate: this.FormPhanCong.controls["duedate"].value
    }
    this.api.PhanCong(req).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          this.message.create(res.status.toLowerCase(), res.message);
          this.handleCancel();
          this.GetAuditDetailOwner();
        } else {
          this.message.create(res.status.toLowerCase(), res.message);
        }
      },
      error: (err) => {
        console.error(err);
        if (err.status === 0) {
          this.message.error('Không thể kết nối tới server');
        } else if (err.status === 401) {
          this.message.error('Phiên đăng nhập đã hết hạn');
        } else if (err.status === 500) {
          this.message.error('Lỗi hệ thống');
        } else {
          this.message.error(err?.error?.message || 'Gọi API thất bại');
        }
      }
    });

  }

  async openCamera(): Promise<void> {
    try {
      this.closeCamera();
      this.isShowCam.set(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      this.cameraStream = stream;

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

  closeCamera(): void {
    this.isShowCam.set(false);
    const video = this.videoRef?.nativeElement;

    // Dừng camera đang được component quản lý
    this.cameraStream?.getTracks().forEach(track => {
      track.stop();
    });

    this.cameraStream = null;

    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }

}
