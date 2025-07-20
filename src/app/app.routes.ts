import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'app-profile-setup',
    component: ProfileSetupComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking' 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }