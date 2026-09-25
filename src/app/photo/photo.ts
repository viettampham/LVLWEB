import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
@Component({
  imports: [NzDividerModule, NzGridModule],
  selector: 'app-photo',
  styleUrl: './photo.scss',
  templateUrl: './photo.html',
})
export class Photo {}
