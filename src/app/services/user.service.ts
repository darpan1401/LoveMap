import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SheetyService } from './sheety.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private hasProfileSubject = new BehaviorSubject<boolean>(false);
  hasProfile$ = this.hasProfileSubject.asObservable();

  constructor(
    private sheety: SheetyService,
    private auth: AuthService
  ) {}

  async checkProfileStatus(): Promise<boolean> {
    const { data } = await this.auth.getUser();
    
    // Add explicit check for email existence
    if (!data?.user?.email) {
      console.warn('No email found in user data');
      return false;
    }

    // Now TypeScript knows email is definitely a string
    const userEmail: string = data.user.email;
    
    try {
      const exists = await this.sheety.checkProfileExists(userEmail);
      this.hasProfileSubject.next(exists);
      return exists;
    } catch (error) {
      console.error('Error checking profile status:', error);
      return false;
    }
  }

  markProfileComplete() {
    this.hasProfileSubject.next(true);
  }
}