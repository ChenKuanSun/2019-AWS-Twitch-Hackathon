import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { twitch } from '../shared/utils';
import { TwitchProduct } from '../shared/interface';
import { NbThemeService } from '@nebular/theme';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token$ = new BehaviorSubject<string>(null);
  uid$ = new BehaviorSubject<string>(null);

  constructor(
    private httpClient: HttpClient,
    private themeService: NbThemeService,
  ) {
    twitch.onContext((context) => {
      twitch.rig.log(context);
      if (context.theme === 'dark') {
        this.themeService.changeTheme('dark');
      } else {
        this.themeService.changeTheme('default');
      }
    });

    twitch.onAuthorized((auth) => {
      // save our credentials
      this.token$.next(auth.token);
      this.uid$.next(auth.userId);
      console.log(auth.token);
      console.log(auth.userId);
    });

    twitch.listen('broadcast', (target, contentType, color) => {
      twitch.rig.log('Received broadcast color');
    });

    twitch.bits.onTransactionComplete((obj) => {
      console.log(JSON.stringify(obj));
      const resData = {
        displayName: obj.product.displayName,
        sku: obj.product.sku
      };
      this.httpClient.post(`${environment.REST_API_URL}/overlay`, resData).subscribe((e) => console.log(e));
    });
  }


  buyProduct(sku: string): void {
    twitch.bits.useBits(sku);
  }

  getProducts$ = () =>
    from(twitch.bits.getProducts())
}
