import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [NzTabsModule, NzSelectModule, NzDatePickerModule, NzCardModule, NzInputModule, NzButtonModule],
  selector: 'app-dangkynghiphep',
  styleUrl: './dangkynghiphep.scss',
  templateUrl: './dangkynghiphep.html',
})
export class Dangkynghiphep {
  CurrentUser: any = null;
  constructor(private authService: AuthService, private router: Router){

  }

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.CurrentUser = user;
    } else {
      this.router.navigate(['']);
    }
  }
}
