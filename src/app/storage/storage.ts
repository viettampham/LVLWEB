import { Component, signal,ViewChild, ElementRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { ContModal } from '../../model/Responsemodel/ContModal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BookOutline } from '@ant-design/icons-angular/icons';
import { ConImageResponse } from '../../model/Responsemodel/ConImageResponse';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  imports: [
    NzTableModule,
    NzIconDirective,
    NzPaginationComponent,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSpinModule,
    NgIf
],
  selector: 'app-storage',
  styleUrl: './storage.scss',
  templateUrl: './storage.html',
  providers: [NzMessageService],
})
export class Storage {
  isLoading = signal(false);
  listOfData = signal<ContModal[]>([]);

  dataListImage = signal<ConImageResponse[]>([]);
  isVisibleButtonCamera = signal(false);

  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  readonly isVisible = signal(false);
  idCont = signal(0);
  readonly isVisibleCam = signal(false);
  formAddCont: FormGroup;
  filterForm: FormGroup;

  DataViewCont: ContModal | null = null;

  capturedImage: string | null = null;

  videoElement!: HTMLVideoElement;
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;
  stream!: MediaStream;
  CurrentUser: any = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: Api,
    private message: NzMessageService
  ) {
    this.formAddCont = this.fb.group({
      soBooking: this.fb.control('', [Validators.required]),
      soCont: this.fb.control('', [Validators.required]),
      soLuongAnh: this.fb.control(''),
      nguoiKhaiBao: this.fb.control('', [Validators.required]),
    });
    this.filterForm = this.fb.group({
      soBooking: this.fb.control(''),
      soCont: this.fb.control(''),
    });
  }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
      this.formAddCont.patchValue({
        nguoiKhaiBao: this.CurrentUser.Fullname,
      });

      this.SearchCont();

    } else {
      this.router.navigate(['']);
    }
  }

  SearchCont(){
    var request = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      soBooking: this.filterForm.get('soBooking')?.value || '',
      soCont: this.filterForm.get('soCont')?.value || '',
    };

    this.api.SearchCont(request).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        this.listOfData.set(res.data.data);
        this.totalRecords.set(res.data.totalRecords);
      }else
      {
        this.message.error(res.message);
      }
    });
  }

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.SearchCont();
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
    this.SearchCont();
  }

  showModal(): void {
    this.isVisibleButtonCamera.set(false);
    console.log(this.isVisibleButtonCamera());
    this.isVisible.set(true);
    this.formAddCont.reset();
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.formAddCont.patchValue({
        nguoiKhaiBao: user.Fullname,
        soLuongAnh: 0,
      });
    }
    this.dataListImage.set([]);
  }

  async openCamera() {
    try {
      this.isVisible.set(false);
      this.isVisibleCam.set(true);
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

      console.log('Camera settings:', stream.getVideoTracks()[0].getSettings());
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
    this.isVisible.set(true);
    this.ViewDsImage(this.DataViewCont!);
  }

  async captureImage() {
    const video = this.videoRef.nativeElement;

    if (!video.videoWidth || !video.videoHeight) {
      return;
    }

    try {

      // Lấy GPS
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000
            }
          );
        }
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Lấy địa chỉ từ tọa độ
      let locationText = 'Không xác định';

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        const address = data.address || {};

        const ward =
          address.suburb ||
          address.quarter ||
          address.village ||
          address.town ||
          address.city_district ||
          '';

        const city =
          address.city ||
          address.province ||
          address.state ||
          '';

        locationText = [ward, city]
          .filter(Boolean)
          .join(', ');

      } catch (e) {
        console.error('Lỗi lấy địa chỉ:', e);
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      // Chụp ảnh
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const now = new Date();

      const timeText = now.toLocaleString('vi-VN');

      // Nền mờ
      context.fillStyle = 'rgba(0,0,0,0.6)';
      context.fillRect(
        10,
        canvas.height - 110,
        700,
        90
      );

      // Chữ
      context.fillStyle = '#ffffff';
      context.font = '24px Arial';

      context.fillText(
        timeText,
        20,
        canvas.height - 65
      );

      context.fillText(
        locationText,
        20,
        canvas.height - 25
      );

      // Preview
      this.capturedImage = canvas.toDataURL(
        'image/jpeg',
        0.9
      );

      // Upload
      canvas.toBlob((blob) => {

        if (!blob) {
          return;
        }

        const file = new File(
          [blob],
          `photo_${Date.now()}.jpg`,
          {
            type: 'image/jpeg'
          }
        );

        const req = new FormData();

        req.append(
          'idCont',
          this.idCont().toString()
        );

        req.append(
          'nguoiChup',
          this.CurrentUser.Fullname
        );

        req.append(
          'image',
          file
        );

        this.api
          .AddImagetoCont(req)
          .subscribe((res: any) => {

            if (res.status === 'SUCCESS') {
              this.message.success(res.message);
              this.closeCamera();
            } else {
              this.message.error(res.message);
            }

          });

      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error(error);
      this.message.warning(
        'Không lấy được vị trí hiện tại. Vui lòng bật Location trên thiết bị.'
      );
    }
  }

  handleCancel(): void {
    this.isVisible.set(false);
    this.idCont.set(0);
  }

  submitForm() {
    this.api.DeclareCont(this.formAddCont.value).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        this.message.success(res.message);
        this.dataListImage.set(res.data.lstDataImage);
        this.idCont.set(res.data.idCont);
        this.isVisibleButtonCamera.set(true);
        this.formAddCont.value.idCont = this.idCont;
        this.DataViewCont = this.formAddCont.value;
        this.SearchCont();
      } else {
        this.message.error(res.message);
      }
    });
  }

  ViewDsImage(data: ContModal) {
    console.log('ViewDsImage called with data:', data);
    this.isVisibleButtonCamera.set(true);
    this.DataViewCont = data;
    this.isVisible.set(true);
    this.idCont.set(data.id);
    this.formAddCont.patchValue({
      soBooking: data.soBooking,
      soCont: data.soCont,
      soLuongAnh: data.soLuongAnh,
      nguoiKhaiBao: data.nguoiKhaiBao,
    });
    this.api.DeclareCont(this.formAddCont.value).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        this.dataListImage.set(res.data.lstDataImage);
        this.idCont.set(res.data.idCont);
        this.SearchCont();
      } else {
        this.message.error(res.message);
      }
    });
  }

  viewImage(id: number) {
  }

  downloadImage(data: ContModal) {
    console.log(data);
    console.log('Download image for id:', data.id, 'soBooking:', data.soBooking, 'soCont:', data.soCont);
    this.isLoading.set(true);
    this.api.DownloadImage(data.id).subscribe((res: any) => {
      if (res) {
        const blob = new Blob([res], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.soBooking}_${data.soCont}_${data.id}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        this.message.error('Download failed');
      }
      this.isLoading.set(false);
    }, (error) => {
      this.message.error('Download failed');
      this.isLoading.set(false);
    });
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
}
