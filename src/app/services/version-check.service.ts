import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private updatePromptShown = false;

  constructor(private sw: SwUpdate) {
    this.initVersionChecks();
  }

  private isMobileDevice(): boolean {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }

  private initVersionChecks() {
    if (!this.sw.isEnabled) {
      console.log('Service Worker not enabled');
      return;
    }

    // Check immediately
    this.checkForUpdate();

    // Check every 6 hours
    interval(6 * 60 * 60 * 1000).subscribe(() => this.checkForUpdate());

    // Listen for available updates
    this.sw.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY'),
      first() // Only take the first update event
    ).subscribe(event => {
      console.log('Version update event:', event);
      this.handleUpdate();
    });

    // Handle unrecoverable state
    this.sw.unrecoverable.subscribe(event => {
      console.error('Unrecoverable state:', event.reason);
      this.promptReload();
    });
  }

  checkVersion() {
    if (this.sw.isEnabled) {
      this.checkForUpdate();
    }
  }

  private async checkForUpdate() {
    try {
      const updateFound = await this.sw.checkForUpdate();
      console.log(updateFound ? 'Update found' : 'No update found');
    } catch (error) {
      console.error('Update check failed', error);
    }
  }

  private handleUpdate() {
    if (this.isMobileDevice()) {
      this.promptUpdate();
    } else {
      // For desktop/large screens, update automatically
      this.applyUpdate();
    }
  }

  private promptUpdate() {
    if (this.updatePromptShown) return;
    
    this.updatePromptShown = true;
    
    const shouldUpdate = confirm('A new version is available. Would you like to update now?');
    if (shouldUpdate) {
      this.applyUpdate();
    }
  }

  private applyUpdate() {
    this.sw.activateUpdate().then(() => {
      document.location.reload();
    });
  }

  private promptReload() {
    const shouldReload = confirm('An error occurred that requires a reload. Would you like to reload now?');
    if (shouldReload) {
      document.location.reload();
    }
  }
}