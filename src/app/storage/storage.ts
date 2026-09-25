import { Component, signal } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { ContModal } from '../../model/Responsemodel/ContModal';
import { NzButtonModule } from 'ng-zorro-antd/button'

@Component({
  imports: [NzTableModule, NzIconDirective, NzPaginationComponent, NzButtonModule],
  selector: 'app-storage',
  styleUrl: './storage.scss',
  templateUrl: './storage.html',
})
export class Storage {
  listOfData = signal<ContModal[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);

  ChangePageIndex(pageIndex: number) {
    this.pageIndex.set(pageIndex);
  }

  ChangePageSize(pageSize: number) {
    this.pageSize.set(pageSize);
  }
}
