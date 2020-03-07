import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
import { ConfigComponent } from './pages/config/config.component';

const routes: Routes = [
  // 沒有Token就轉到Auth
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ConfigComponent,
      },
      {
        path: 'index',
        component: IndexComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

