import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSession = new BehaviorSubject<any>(null);
  public userSession$ = this.userSession.asObservable();

  constructor(private router: Router) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Load session from storage
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      this.userSession.next(null);
      return;
    }

    this.userSession.next(session);

    // Set up auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      this.userSession.next(session);

      // Handle navigation based on auth state
      if (event === 'SIGNED_IN') {
        this.router.navigate(['/app-profile-setup']);
      } else if (event === 'SIGNED_OUT') {
        this.router.navigate(['/']);
      }
    });
  }

  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/app-profile-setup',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('Google login error:', error.message);
      throw error;
    }
  }

  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return { data: { user }, error: null };
    } catch (error) {
      console.error('getUser() error:', error);
      return { data: { user: null }, error };
    }
  }

  isLoggedIn(): boolean {
    return !!this.userSession.getValue();
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.userSession.next(null);
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}