import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  signedIn$ = new BehaviorSubject<boolean>(false);
  userInfo$ = new Subject<any>();
  constructor() { }
}
