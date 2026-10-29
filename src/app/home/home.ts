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
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      this.CurrentUser = user;
    } else {
      this.router.navigate(['']);
    }
    console.log('CurrentUser', this.CurrentUser);
  }

  onHandleGoTo(routerlink: string, breacum: string) {
    this.router.navigate([routerlink]);
    this.breacums = breacum.split(',');
  }
}
