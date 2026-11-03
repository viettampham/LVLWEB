import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = signal(false);
  constructor() { }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  getLoading() {
    return this.loading();
  }
}
