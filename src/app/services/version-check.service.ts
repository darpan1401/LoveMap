import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  constructor(private sw: SwUpdate) {
    this.initVersionChecks();
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
    this.sw.versionUpdates.subscribe(event => {
      console.log('Version update event:', event);
      if (event.type === 'VERSION_READY') {
        this.promptUpdate();
      }
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

  private promptUpdate() {
    // In a real app, consider using a proper dialog/modal component
    const shouldUpdate = confirm('A new version is available. Would you like to update now?');
    if (shouldUpdate) {
      this.sw.activateUpdate().then(() => {
        document.location.reload();
      });
    }
  }

  private promptReload() {
    const shouldReload = confirm('An error occurred that requires a reload. Would you like to reload now?');
    if (shouldReload) {
      document.location.reload();
    }
  }
}