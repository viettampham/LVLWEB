import { Component, OnInit, signal } from '@angular/core';
import { NzBreadCrumbComponent, NzBreadCrumbItemComponent } from 'ng-zorro-antd/breadcrumb';
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { AuthService } from '../services/auth.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  imports: [
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzContentComponent,
    NzFooterComponent,
    NzHeaderComponent,
    NzIconDirective,
    NzLayoutComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    RouterOutlet,
    CommonModule,
    NzAvatarModule,
    NzDropdownModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  protected readonly date = new Date();
  breacums: string[] = [];
  CurrentUser: any = null;
  isShowModalChangePassword = signal(false);
  formChangePassword: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private api: Api,
  ) {
    this.formChangePassword = this.fb.group({
      currentPass: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      confirmNewPass: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      this.CurrentUser = this.parseJwt(token);
      this.authService.setCurrentUser(this.parseJwt(token));
    } else {
      this.router.navigate(['']);
    }
    // console.log('CurrentUser', this.CurrentUser);
  }

  handleLogOut() {
    this.router.navigate(['']);
    sessionStorage.clear();
  }

  changePassword() {
    this.isShowModalChangePassword.set(true);
  }

  onHandleGoTo(routerlink: string, breacum: string) {
    this.router.navigate([routerlink]);
    this.breacums = breacum.split(',');
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  handleCancel() {
    this.isShowModalChangePassword.set(false);
  }

  handleOk() {
    var req = {
      codeUser: this.CurrentUser.CodeUser,
      currentPass: this.formChangePassword.value.currentPass,
      newPass: this.formChangePassword.value.newPass,
      confirmNewPass: this.formChangePassword.value.confirmNewPass,
    };

    this.api.ChangePassword(req).subscribe({
      next: (res) => {
        if (res.status == 'SUCCESS') {
          this.message.create('success', 'Đổi mật khẩu thành công');
          this.handleLogOut();
        }else{
          this.message.create(res.status.toLowerCase(), res.message);
        }
      },
      error: (err) => {
        this.message.create('error', err.message);
      },
    });
  }
}
