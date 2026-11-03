import { Component } from '@angular/core';
import { NzBreadCrumbComponent, NzBreadCrumbItemComponent } from 'ng-zorro-antd/breadcrumb';
import { NzContentComponent, NzFooterComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { AuthService } from '../services/auth.service';


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
    NzDropdownModule
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly date = new Date();
  breacums: string[] = [];
  CurrentUser: any = null;
  constructor(private router: Router, private authService: AuthService) {

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

  handleLogOut(){
    this.router.navigate([""]);
    sessionStorage.clear();
  }

  onHandleGoTo(routerlink: string, breacum: string) {
    this.router.navigate([routerlink]);
    this.breacums = breacum.split(',');
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
