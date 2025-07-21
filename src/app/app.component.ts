import { Component, OnInit, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { VersionCheckService } from './services/version-check.service';
import { Platform } from '@angular/cdk/platform';
import { NotificationComponent } from './shared/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashScreenComponent, CommonModule,NotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showSplash = false;
  deferredPrompt: any;
  isOnline = navigator.onLine;
  showInstallBtn = false;
  dismissedInstall = false;
  isDevMode = isDevMode();
  isIosSafari = false; // Added for iOS Safari detection

  constructor(
    private versionCheck: VersionCheckService,
    private platform: Platform
  ) {
    this.dismissedInstall = localStorage.getItem('pwaDismissed') === 'true';
    console.log('Development Mode:', this.isDevMode);
    this.detectIosSafari(); // Initialize iOS Safari detection
  }

  ngOnInit() {
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile Browser:', this.isMobileBrowser());
    console.log('Is Running as PWA:', this.isRunningAsPWA());

    this.versionCheck.checkVersion();
    if (!this.isDevMode) {
      this.setupPWAInstallPrompt();
    }
    this.setupNetworkListeners();

    if (!this.isMobileBrowser() || this.isRunningAsPWA()) {
      this.showSplash = true;
      setTimeout(() => {
        this.showSplash = false;
      }, 3000);
    }
  }

  // iOS Safari detection
  private detectIosSafari(): void {
    const ua = navigator.userAgent;
    const iOS = this.platform.IOS || /iPad|iPhone|iPod/.test(ua);
    const webkit = /WebKit/.test(ua);
    this.isIosSafari = iOS && webkit && !/CriOS|OPiOS/.test(ua);
  }

  isMobileBrowser(): boolean {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isTouchDevice = /android|iphone|ipad|ipod|tablet|mobile|iemobile|blackberry/i.test(ua.toLowerCase());
    const isSmallScreen = window.innerWidth <= 820; 
    return isTouchDevice && isSmallScreen;
  }

  isRunningAsPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }

  private setupPWAInstallPrompt() {
    if (!this.isMobileBrowser() || this.isRunningAsPWA()) return;

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;

      if (!this.dismissedInstall) {
        this.showInstallBtn = true;
      }
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }

        this.showInstallBtn = false;
        this.dismissedInstall = true;
        localStorage.setItem('pwaDismissed', 'true');
      });
    } else {
      alert('To install this app, use "Add to Home Screen" from your browser menu.');
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
  }
}