import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { AuditDetailResponse } from '../../model/Responsemodel/AuditDetailResponse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  imports: [NzTableModule, NzButtonModule, CommonModule,NzTagModule,NzIconModule,
    NzPaginationComponent, NzIconModule, NzFormModule, NzInputModule, ReactiveFormsModule, NzDatePickerModule, NzSelectModule, NzModalModule],
  selector: 'app-hisdaily',
  styleUrl: './hisdaily.scss',
  templateUrl: './hisdaily.html',
})
export class Hisdaily {
  listOfData = signal<AuditDetailResponse[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  searchForm: FormGroup;
  CurrentUser: any = null;
  readonly isVisible = signal(false); 
  selectedItem : any = null;
  iShowCard = signal(false);
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  private cameraStream: MediaStream | null = null;
  capturedImage = ''; 
  capturedImageAfter = ''; 
  isShowCam = signal(true); 
  idAuditDetail = 0;
  
  constructor(private fb: FormBuilder, private router: Router, private api: Api, private message: NzMessageService){
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.searchForm = this.fb.group({
      assignee: [''],
      status: [''],
      //dateChose: [[firstDayOfMonth, today]]
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
      this.searchForm.patchValue({
        assignee: this.CurrentUser.Fullname,
        status: "Mới phát hiện"
      });
    } else {
      this.router.navigate(['']);
    }
    console.log('CurrentUser', this.CurrentUser);
    this.SearchAuditDetail();
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.SearchAuditDetail();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.SearchAuditDetail();
  }

  SearchAuditDetail(){
    //const [from, to] = this.searchForm.value.dateChose || [];
    var req = {
      pageIndex : this.pageIndex,
      pageSize: this.pageSize,
      assignee: this.searchForm.controls['assignee'].value,
      //fromDate: from? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`: null,
      //toDate: to? `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`: null,
      status: this.searchForm.controls['status'].value,
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
    const date = new Date(dateTimeString);
    const result =
      String(date.getDate()).padStart(2, '0') + '/' +
      String(date.getMonth() + 1).padStart(2, '0') + '/' +
      date.getFullYear()
      ;

    return result;
  }

  DetailCheck(item: number){
    this.idAuditDetail = item;
    this.api.GetAuditDetailById(item).subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.selectedItem = res.data;
        if(res.data.imageAfter){
          this.isShowCam.set(false);
          this.capturedImageAfter = res.data.imageAfter;
        }else{
          this.isShowCam.set(true);
          this.capturedImageAfter = "";
        }
        this.iShowCard.set(true);
      }else{
        this.selectedItem = null;
        this.iShowCard.set(false);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    });
    this.isVisible.set(true)
  }

  handleCancel(){
    this.isVisible.set(false);
    this.iShowCard.set(false);
  }

   base64ToBlob(base64: string): Blob {
    console.log(base64);
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

    if(this.capturedImageAfter == null || this.capturedImageAfter == ""){
      this.message.create('error', "Vui lòng chụp ảnh sau khi khắc phục");
      return;
    }

    var formData = new FormData();
    const imageBlob = this.base64ToBlob(this.capturedImageAfter);


    formData.append('IdAuditDetail', this.idAuditDetail.toString());
    formData.append('ImageAfter', imageBlob);

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
