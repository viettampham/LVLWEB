import { ChangeDetectorRef, Component, OnInit, ElementRef, signal, ViewChild, AfterViewInit,OnDestroy } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OperationStandardResponse } from '../../model/Responsemodel/OperationStandardResponse';
import { DetechIssueResponse } from '../../model/Responsemodel/DetechIssueResponse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadChangeParam, NzUploadComponent } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  imports: [
    NzButtonModule,
    NzStepsModule,
    NzSelectModule,
    CommonModule,
    NzFormItemComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule,
    NzIconModule,
    NzUploadComponent,
    NzSwitchModule
],
  selector: 'app-mobilecheck',
  styleUrl: './mobilecheck.scss',
  templateUrl: './mobilecheck.html',
})
export class Mobilecheck implements OnInit, AfterViewInit, OnDestroy {
  isMobile = window.innerWidth < 576;
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  capturedImage = '';
  CurrentUser: any = null;
  readonly current = signal(0);
  private cameraStream: MediaStream | null = null;
  formAssignee: FormGroup;  
  lstAssignee = signal<any[]>([]);
  lstOperationStandard = signal<OperationStandardResponse[]>([]);
  lstDetechIssue = signal<DetechIssueResponse[]>([]);
  lstLocation = signal<string[]>([]);
  private id = Math.random().toString(36).substring(2);
  constructor(private cdr: ChangeDetectorRef, 
    private router: Router, 
    private fb: FormBuilder,
    private api :Api,
    private message: NzMessageService
  ){
    console.log('constructor', this.id);
    const today = new Date();
    this.formAssignee = this.fb.group({
      note: [''],
      isPrivate: [false, Validators.required],
      duedate: [today],
      assignee: [''],
      operationstandard: ['',[Validators.required]],
      detechissue: ['',[Validators.required]],
      location: ['',[Validators.required]],
    });
  }

  GetLocation(){
    this.api.GetLocation().subscribe(res=>{
      if(res.status == "SUCCESS"){
        this.lstLocation.set(res.listData);
      }else{
        this.lstLocation.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    });
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

  async ngOnInit(): Promise<void> {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
      console.log('oninit');
      await this.GetAssignee();
      await this.GetOperationStandard();
      await this.GetLocation();
    } else {
      this.router.navigate(['']);
    }

    this.formAssignee.get('operationstandard')?.valueChanges.subscribe(value => {
      console.log('Tiêu chuẩn được chọn:', value);
      this.funcGetDetechIssue(value);
    });
  }

  async ngAfterViewInit() {
    console.log('viewinit');
    await this.openCamera();
  }

  ngOnDestroy() {
    console.trace('destroy', this.id);
    // this.closeCamera();
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
        this.formAssignee.patchValue({
          detechissue: "",
        });
      }else{
        this.lstDetechIssue.set([]);
        this.message.create(res.status.toLowerCase(), res.message);
      }
    })
  }

  pre(): void {
    this.current.update(current => current - 1);
    if(this.current() == 0){
      this.openCamera();
    }
  }

  next(): void {
    this.current.update(current => current + 1);
  }

  done(): void {
     this.resetForm();
  }

  UploadImage(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} file upload failed.`);
    }
  }

  beforeUpload = (file: any): boolean => {
    const reader = new FileReader();

    reader.onload = () => {
      this.capturedImage = reader.result as string;
      this.closeCamera();
      this.next();
    };

    reader.readAsDataURL(file);
    return false;
  };

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
    this.next();
  }

  async openCamera(): Promise<void> {
    try {
      this.closeCamera();

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

      // console.log(
      //   'Camera settings:',
      //   stream.getVideoTracks()[0].getSettings()
      // );
    } catch (e) {
      console.error('Không thể mở camera:', e);
    }
  }
  
  closeCamera(): void {
    try {
      const video = this.videoRef?.nativeElement as HTMLVideoElement;

      // Dừng stream trên video trước
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;

        stream.getTracks().forEach(track => {
          console.log('Stopping:', track.kind, track.readyState);
          track.stop();
          console.log('Stopped:', track.kind, track.readyState);
        });

        video.pause();
        video.srcObject = null;
        video.removeAttribute('src');
        video.load();
      }

      // Dừng stream đang lưu trong biến
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
      }

      this.cameraStream = null;
    } catch (err) {
      console.error('Lỗi khi đóng camera:', err);
    }
  }

  SubmitFormAssigee(status: string){
    if (this.formAssignee.valid) {
      var formData = new FormData();
      formData.append('IdAudit', '0');
      formData.append('IsPrivate', this.formAssignee.controls['isPrivate'].value);

      formData.append('IdOps', this.formAssignee.controls['operationstandard'].value);
      formData.append('IdDetachIssue', this.formAssignee.controls['detechissue'].value);
      formData.append('Assignee', this.formAssignee.controls['assignee'].value);
      
      const dueDate = new Date(
        this.formAssignee.controls['duedate'].value
      ).toISOString().split('T')[0];

      formData.append('DueDate', dueDate);
      formData.append('Evalue', "NG");
      formData.append('Location', this.formAssignee.controls['location'].value);
      formData.append('Note', this.formAssignee.controls['note'].value);
      formData.append('Status', status);
      formData.append('Owner', this.CurrentUser.Fullname);
      const imageBlob = this.base64ToBlob(this.capturedImage);

      formData.append('ImageBefore', imageBlob);
      this.api.CreateAuditDetail(formData).subscribe(res=>{
        if(res.status == "SUCCESS"){
          this.message.create(res.status.toLowerCase(), res.message);
          this.next();
        }else{
          this.message.create(res.status.toLowerCase(), res.message);
        }
      });
      
    } else {
      Object.values(this.formAssignee.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  resetForm(){
    this.formAssignee.reset();
    this.capturedImage = "";
    this.current.set(0);
    this.openCamera();
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

}
