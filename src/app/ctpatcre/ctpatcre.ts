import { Component, OnInit, signal  } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Api } from '../services/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CtpatCriteria } from '../../model/Responsemodel/CtpatCriteria';
import { CommonModule,NgFor } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  imports: [NzCollapseModule, CommonModule, NzIconModule, NzButtonComponent],
  selector: 'app-ctpatcre',
  styleUrl: './ctpatcre.scss',
  templateUrl: './ctpatcre.html',
})
export class Ctpatcre implements OnInit {
  panels = signal<CtpatCriteria[]>([]);
  active = signal(true);
  textbutton = signal("Thu lại");
  constructor(private api: Api,
    private message: NzMessageService
  ){

  }

  ngOnInit(): void {
    this.api.GetCtpatCriteria().subscribe({
      next:(res=>{
        this.panels.set(res.listData);
        console.log(this.panels);
      }), error:(err=>{
        this.message.create("error","Lỗi " + err.message);
      })
    })
  }

  OnCollapse(){
    this.active.set(!this.active());
    if(this.active()){
      this.textbutton.set("Thu lại");
    }else{
      this.textbutton.set("Mở rộng");
    }
  }
}
