import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  showPhoneForm = false;
  showOtpForm = false;
  phoneNumber: string = '';
  otpDigits: string[] = Array(6).fill('');

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    setTimeout(async () => {
  const { data } = await this.authService.getUser();
  if (data?.user) {
    this.router.navigate(['/app-profile-setup']);
  }
}, 100);
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      // After login, Supabase will redirect to same origin
      // ngOnInit will handle redirection
    } catch (error: any) {
      this.errorMessage = error.message || 'Google login failed.';
      this.isLoading = false;
    }
  }

  openPhoneForm() {
    this.showPhoneForm = true;
    this.showOtpForm = false;
    this.phoneNumber = '';
    this.otpDigits = Array(6).fill('');
  }

  validateNumber(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  submitPhone() {
    if (this.phoneNumber.length === 10 && /^[0-9]+$/.test(this.phoneNumber)) {
      this.showOtpForm = true;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please enter a valid 10-digit phone number.';
    }
  }

  moveToNext(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const nextInput = document.querySelectorAll<HTMLInputElement>('.otp-box')[index + 1];
      nextInput?.focus();
    }
  }

  moveToPrev(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.querySelectorAll<HTMLInputElement>('.otp-box')[index - 1];
      prevInput?.focus();
    }
  }

  submitOtp() {
    const otp = this.otpDigits.join('');
    console.log('OTP submitted:', otp);
    // TODO: Implement OTP verification logic
  }
}