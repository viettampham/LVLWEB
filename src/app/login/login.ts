import { Component, inject } from '@angular/core';
import { NzInputDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Api } from '../services/api';
import { Router } from '@angular/router';

@Component({
  imports: [
    NzInputWrapperComponent,
    NzInputDirective,
    NzCheckboxComponent,
    NzButtonComponent,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzIconDirective,
    NzRowDirective,
    NzColDirective,
    NzIconModule,
  ],
  providers: [],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  validateForm: FormGroup;
  constructor(
    private api: Api,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private route: Router
  ) {
    this.validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(true),
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.api.Authentication(this.validateForm.value).subscribe({
        next: (res: any) => {
          if (res.status === 'ERROR') {
            this.message.error(res.message);
          } else if (res.status === 'WARNING') {
            this.message.warning(res.message);
          } else if (res.status === 'SUCCESS') {
            this.message.success(res.message);
            sessionStorage.setItem('token', res.data);
            this.route.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error(err);

          if (err.status === 0) {
            this.message.error('Không kết nối được đến máy chủ');
          } else if (err.status === 404) {
            this.message.error('API không tồn tại (404)');
          } else if (err.status === 500) {
            this.message.error('Lỗi máy chủ (500)');
          } else if (err.status === 401) {
            this.message.error('Phiên đăng nhập không hợp lệ');
          } else {
            this.message.error(`Đã xảy ra lỗi (${err.status})`);
          }
        }
      });

    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
