import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/@core/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  channelID$: BehaviorSubject<string>;
  channelID: string;



  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.channelID$ = this.apiService.channelID$;
    this.channelID$
      .pipe(
        filter((chID) => chID !== null)
      )
      .subscribe(() => {
        this.router.navigate(['/index']);
      });
  }

  ngOnInit() {
  }

}
