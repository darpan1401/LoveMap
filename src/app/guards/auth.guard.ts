import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SheetyService } from '../services/sheety.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const sheety = inject(SheetyService);
  const router = inject(Router);

  try {
    // 1. Check Supabase auth
    const { data, error } = await auth.getUser();
    if (error || !data?.user?.email) {
      return router.createUrlTree(['/']);
    }

    const userEmail = data.user.email;
    
    // 2. Check Sheety profile
    const profileExists = await sheety.checkProfileExists(userEmail);
    console.log('Profile exists:', profileExists); // Debug log
    

    // 3. Handle routing
    if (state.url.includes('/app-profile-setup')) {
      return profileExists ? router.createUrlTree(['/home']) : true;
    } else if (state.url.includes('/home')) {
      return profileExists ? true : router.createUrlTree(['/app-profile-setup']);
    }

    // Default for other protected routes
    return profileExists ? true : router.createUrlTree(['/app-profile-setup']);
    

  } catch (error) {
    console.error('Auth guard error:', error);
    return router.createUrlTree(['/']);
  }
  
};