import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from './loading/loading';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';
@Component({
  imports: [
    RouterOutlet,
    Loading,
    CommonModule
],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('lab');

  constructor(public loadingService : LoadingService){
  }
}
