import { Component, OnInit, signal } from '@angular/core';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  imports: [],
  selector: 'app-listleave',
  styleUrl: './listleave.scss',
  templateUrl: './listleave.html',
})
export class Listleave implements OnInit {
  LstData = signal<any[]>([]);
  pageIndex = signal(1);
  pageSize = signal(10);

  constructor(private api: Api, private message: NzMessageService){
    
  }

  async ngOnInit(): Promise<void> {
    this.handleGetPaging();
  }

  handleGetPaging(){
    var req = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      codeUser: "LVLOG0001",
      status: "Phát hành"

    };
    this.api.GetDsLeavePaging(req).subscribe({
      next:(res)=>{
        this.LstData.set(res.listData);
        console.log(this.LstData());
      },
      error:(err)=>{
        this.message.create("error", err.message);
      }
    })
  }

  

}
