import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './@core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      // return true;

      const signedIn = this.userService.signedIn$;
      if (signedIn.value) {
        // logged in so return true
        return true;
      }
      // 沒Token就保存當前Url待登入後redirect，Redirect到Login頁面。
      return this.router.parseUrl(`/login?redirect=${encodeURI(state.url)}`);
    }
}

