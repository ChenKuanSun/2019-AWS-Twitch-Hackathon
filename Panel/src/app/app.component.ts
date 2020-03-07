import { Component, OnInit } from '@angular/core';
import { twitch } from './shared/utils';
import { ApiService } from './api/api.service';
import { from, concat, BehaviorSubject } from 'rxjs';
import { filter, concatMap, map, tap } from 'rxjs/operators';
import { TwitchProduct } from './shared/interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'twitch-extension-panel';
  products$ = new BehaviorSubject<TwitchProduct[]>([]);

  constructor(
    private apiService: ApiService
  ) {
    this.apiService.token$
      .pipe(
        filter(token => token !== null),
        concatMap(() => this.apiService.getProducts$()),
        tap(products => console.log(products)),
      )
      .subscribe((products: TwitchProduct[]) => this.products$.next(products));
  }

  ngOnInit() {
    twitch.rig.log('Updating block color');
  }

  buyProduct(sku: string) {
    this.apiService.buyProduct(sku);
  }

  showImage(sku: string) {
    return `assets/${sku}.png`;
  }

  bitsLevel(bits: number) {
    if (bits < 100) {
      return 'assets/layout/10.gif';
    } else if (bits >= 100 && bits < 1000) {
      return 'assets/layout/100.gif';
    } else if (bits >= 1000 && bits < 5000) {
      return 'assets/layout/1000.gif';
    } else if (bits >= 5000 && bits < 10000) {
      return 'assets/layout/5000.gif';
    } else if (bits >= 10000 && bits < 100000) {
      return 'assets/layout/10000.gif';
    } else if (bits > 100000) {
      return 'assets/layout/100000.gif';
    }
  }
}
