import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  imports: [NzDatePickerModule, NzTableModule, NzTagModule,
    NzButtonModule, CommonModule, ReactiveFormsModule, NzIconModule
  ],
  selector: 'app-report-leave',
  styleUrl: './report-leave.scss',
  templateUrl: './report-leave.html',
})
export class ReportLeave {
  reportData = signal<any[]>([]);
  topEmployees = signal<any[]>([]);

}
