import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private currentVersion = '1.0.5'; 

  constructor(private http: HttpClient) {}

  public checkVersion() {
    this.http.get<{ version: string }>('/assets/version.json')
      .subscribe(remote => {
        if (remote.version !== this.currentVersion) {
          this.promptUserToUpdate();
        }
      });
  }

  private promptUserToUpdate() {
    if (confirm('A new update is available. Would you like to update now?')) {
      window.location.reload(); 
    }
  }
}
