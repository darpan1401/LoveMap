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

  constructor(private versionCheck: VersionCheckService) {}

  ngOnInit() {
    this.versionCheck.checkVersion();
    
    // Check if app is running as PWA
    if (this.isRunningAsPWA()) {
      console.log('Running as PWA');
    } else {
      this.setupPWAInstallPrompt();
    }

    // Track network status
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));

    setTimeout(() => {
      this.showSplash = false;
    }, 3000);
  }

  private isRunningAsPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone;
  }

  private setupPWAInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Only show if not previously dismissed
      if (!this.dismissedInstall) {
        setTimeout(() => {
          this.showInstallBtn = true;
        }, 5000); // Show after 5 seconds
      }
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
          this.showInstallBtn = false;
        }
        this.deferredPrompt = null;
      });
    }
  }

  dismissInstall() {
    this.showInstallBtn = false;
    this.dismissedInstall = true;
    // Store dismissal in localStorage to remember user's choice
    localStorage.setItem('pwaDismissed', 'true');
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    if (!isOnline) {
      console.log('App is offline');
    }
  }
}