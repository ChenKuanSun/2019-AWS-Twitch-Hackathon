import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(
    public sender: string,
    public content: string,
    public isBroadcast = false,
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  channelID$ = new BehaviorSubject<string>('35723728');
  socket$ = webSocket('wss://bjalreywgh.execute-api.ap-northeast-1.amazonaws.com/env');
  constructor(
  ) {}

}
