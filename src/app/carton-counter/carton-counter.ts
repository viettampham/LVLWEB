import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { HttpClient } from '@angular/common/http';
import { sign } from 'node:crypto';
@Component({
  imports: [
    NzUploadComponent,
    NzIconDirective,
    NzButtonComponent,
    CommonModule,
    NzFlexDirective,
    NzRowDirective,
    NzColDirective,
    NzEmptyComponent,
  ],
  selector: 'app-carton-counter',
  styleUrl: './carton-counter.scss',
  templateUrl: './carton-counter.html',
})
export class CartonCounter {
  imagePreview = signal<string>('');
  constructor() {}
  // @ts-ignore
  readonly #messageService = inject(NzMessageService);
  readonly http = inject(HttpClient);
  counter = signal(0);
  linkscr = signal('');
  isRes = signal(false);
  beforeUpload = (file: NzUploadFile): boolean => {
    const allowTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    const isValid = allowTypes.includes(file.type!);

    if (!isValid) {
      this.#messageService.error('Chỉ hỗ trợ PNG, JPG, JPEG, WEBP');
      return false;
    }

    // Preview ảnh
    const rawFile = file as unknown as File;

    this.imagePreview.set(URL.createObjectURL(rawFile));

    // Gọi API
    const formData = new FormData();
    formData.append('file', rawFile);

    this.http.post<any>('http://localhost:5000/count', formData).subscribe({
      next: (res) => {
        console.log('Kết quả:', res);
        this.counter.set(res.count);
        this.linkscr.set(res.image_url);
        this.isRes.set(true);
        console.log(this.counter);
      },
      error: (err) => {
        console.error(err);
        this.isRes.set(false);
        this.linkscr.set("");
        this.counter.set(0);
        this.#messageService.error('Lỗi gọi API');
      },
    });

    return false;
  };
}
