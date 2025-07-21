import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { VersionCheckService } from './services/version-check.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showSplash = true;
  deferredPrompt: any;
  isOnline = navigator.onLine;
  showInstallBtn = false;
  dismissedInstall = false;
  isMobile = this.detectMobile();

  constructor(private versionCheck: VersionCheckService) {
    // Check for previous dismissal
    this.dismissedInstall = localStorage.getItem('pwaDismissed') === 'true';
  }

  ngOnInit() {
    this.versionCheck.checkVersion();

    // Only show splash screen if not mobile or is PWA
    if (!this.isMobile || this.isRunningAsPWA()) {
      setTimeout(() => {
        this.showSplash = false;
      }, 3000);
    } else {
      this.showSplash = false; // Hide splash immediately on mobile browser
    }

    this.setupPWAInstallPrompt();
    this.setupNetworkListeners();
  }

  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private isRunningAsPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone;
  }

  private setupPWAInstallPrompt() {
    // Skip if not mobile or already running as PWA
    if (!this.isMobile || this.isRunningAsPWA()) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      if (!this.dismissedInstall) {
        // Show immediately for mobile as per requirements
        this.showInstallBtn = true;
      }
    });
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
        this.showInstallBtn = false;
        this.dismissedInstall = true;
        localStorage.setItem('pwaDismissed', 'true');
      });
    } else {
      // Fallback instructions for browsers that don't support the prompt
      alert('To install this app, look for "Add to Home Screen" in your browser\'s menu.');
    }
  }


  private updateOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    // Add any offline-specific logic here
  }
}