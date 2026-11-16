import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Api } from '../services/api';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { formatDate } from '@angular/common';

@Component({
  imports: [NzDatePickerModule, NzTableModule, NzTagModule,
    NzButtonModule, CommonModule, ReactiveFormsModule, NzIconModule, NzFormModule],
  selector: 'app-report-leave',
  styleUrl: './report-leave.scss',
  templateUrl: './report-leave.html',
})
export class ReportLeave implements OnInit {
  dataDashBoard = signal<any>(null);
  FormGetReport: FormGroup;
  constructor(private api: Api, private fb: FormBuilder, private message: NzMessageService,) {
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    this.FormGetReport = this.fb.group({
      fromDate: [firstDayOfMonth, [Validators.required]],
      toDate: [lastDayOfMonth, [Validators.required]]
    });
  }
  async ngOnInit(): Promise<void> {
    this.GetDashboardReportLeave();
  }


  GetDashboardReportLeave() {
    var req = {
      fromDate: formatDate(
        this.FormGetReport.controls['fromDate'].value,
        'yyyy-MM-dd',
        'en-US'
      ),
      toDate: formatDate(
        this.FormGetReport.controls['toDate'].value,
        'yyyy-MM-dd',
        'en-US'
      )
    };

    this.api.ReportLeaveDashboard(req).subscribe({
      next: (res) => {
        this.dataDashBoard.set(res.data);
        console.log(this.dataDashBoard());
      }, error: (err) => {
        this.message.create("error", err.message);
      }
    })

  }

  HandleExportReport() {
    const req = {
      fromDate: formatDate(
        this.FormGetReport.controls['fromDate'].value,
        'yyyy-MM-dd',
        'en-US'
      ),
      toDate: formatDate(
        this.FormGetReport.controls['toDate'].value,
        'yyyy-MM-dd',
        'en-US'
      )
    };

    this.api.ExportReportLeave(req).subscribe({
      next: (res: Blob) => {

        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `BaoCaoNghiPhep_${formatDate(
          new Date(),
          'yyyyMMddHHmmss',
          'en-US'
        )}.xlsx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);

        this.message.success('Xuất báo cáo thành công');
      },
      error: (err) => {
        this.message.error('Xuất báo cáo thất bại');
        console.error(err);
      }
    });
  }

}
