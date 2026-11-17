import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  imports: [
    NzSelectModule,
    NzDatePickerModule,
    NzTableModule,
    NzTagModule,
    CommonModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzAvatarModule,
  ],
  selector: 'app-tiep-nhan-nghi-phep',
  styleUrl: './tiep-nhan-nghi-phep.scss',
  templateUrl: './tiep-nhan-nghi-phep.html',
})
export class TiepNhanNghiPhep implements OnInit {
  listData = signal<any[]>([]);
  selectedStatus = 'PENDING';
  dataCount = signal<any>(null);

  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);

  constructor(private api: Api, private message: NzMessageService) {}
  
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit called');
    await this.LoadCountMenuTiepNhan();
    await this.loadData();
  }

  onChangeStatus(status: string): void {
    this.selectedStatus = status;
    this.loadData();
  }

  LoadCountMenuTiepNhan() {
    this.api.GetCountMenuTiepNhan().subscribe({
      next: (res) => {
        if (res.status == 'SUCCESS') {
          this.dataCount.set(res.data);
        } else {
          this.dataCount.set(0);
        }
      },
      error: (err) => {
        this.dataCount.set(0);
      },
    })
  }

  loadData(){
    var req = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      status: this.selectedStatus
    }
    this.api.GetListTiepNhan(req).subscribe({
      next: (res) => {
        if (res.status == 'SUCCESS') {
          this.listData.set(res.data.data);
          this.totalRecords.set(res.totalRecords);
        } else {
          this.listData.set([]);
          this.totalRecords.set(0);
          this.message.error('Failed to load data');
        }
      },
      error: (err) => {
        this.listData.set([]);
        this.totalRecords.set(0);
        this.message.error('An error occurred while loading data');
      },
    })
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
}
