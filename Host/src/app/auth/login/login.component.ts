import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from 'src/app/@core/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signedIn$: BehaviorSubject<boolean>;
  userInfo$: Subject<any>;

  greeting: string;

  constructor(
    private amplifyService: AmplifyService,
    private userservice: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.signedIn$ = this.userservice.signedIn$;
    this.userInfo$ = this.userservice.userInfo$;
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn$.next(authState.state === 'signedIn');
        if (!authState.user) {
          this.userInfo$.next(null);
        } else {
          this.userInfo$.next(authState.user);
          this.greeting = 'Hello ' + authState.user.username;
          setTimeout(() => {
            this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('redirect'));
          }, 3000);
        }
      });
  }

  signUpConfig = {
    header: 'Sign Up',
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 1,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 2,
        type: 'password'
      }
    ]
  };

  ngOnInit() {
  }

}
