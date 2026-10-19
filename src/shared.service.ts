import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private idAudit = new BehaviorSubject<string>('');

  idAudit$ = this.idAudit.asObservable();

  setIdAudit(value: string) {
    this.idAudit.next(value);
  }
}