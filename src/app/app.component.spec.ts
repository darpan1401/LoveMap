import { Component, OnInit, isDevMode } from '@angular/core';
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
  showSplash = false;
  deferredPrompt: any;
  isOnline = navigator.onLine;
  showInstallBtn = false;
  dismissedInstall = false;
  isDevMode = isDevMode();
  isIosSafari = false;

  constructor(private versionCheck: VersionCheckService) {
    this.dismissedInstall = localStorage.getItem('pwaDismissed') === 'true';
    console.log('Development Mode:', this.isDevMode);
  }

  ngOnInit() {
    this.versionCheck.checkVersion();
    this.isIosSafari = this.checkIosSafari();

    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile Browser:', this.isMobileBrowser());
    console.log('Is Running as PWA:', this.isRunningAsPWA());
    console.log('Is iOS Safari:', this.isIosSafari);

    if (!this.isDevMode) {
      this.setupPWAInstallPrompt();
    }

    this.setupNetworkListeners();

    // Splash screen control
    if (!this.isMobileBrowser() || this.isRunningAsPWA()) {
      this.showSplash = true;
      setTimeout(() => {
        this.showSplash = false;
      }, 3000);
    }
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

  checkIosSafari(): boolean {
    const ua = navigator.userAgent;
    return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|opios|chrome/i.test(ua);
  }

  private setupPWAInstallPrompt() {
    if (!this.isMobileBrowser() || this.isRunningAsPWA() || this.isIosSafari) return;

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;

      if (!this.dismissedInstall) {
        this.showInstallBtn = true;
      }
    });
  }

  installPWA() {
    if (this.isIosSafari) {
      alert('To install the app, tap the Share icon in Safari and select "Add to Home Screen".');
      return;
    }

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
