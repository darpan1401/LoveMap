import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private currentVersion = '1.0.5'; // 🔁 Update this at build time

  constructor(private http: HttpClient) {}

  public checkVersion() {
    const versionUrl = 'https://love-map-three.vercel.app/assets/version.json'; // ✅ Full remote path

    this.http.get<{ version: string }>(versionUrl)
      .subscribe(remote => {
        if (remote.version !== this.currentVersion) {
          this.promptUserToUpdate();
        }
      }, error => {
        console.warn('Version check failed', error);
      });
  }

  private promptUserToUpdate() {
    if (confirm('A new version is available. Update now?')) {
      // For web: reload
      // For app: navigate to download page or force refresh
      window.location.href = 'https://github.com/darpan1401/LoveMap/actions'; // 👉 your GitHub build page or APK direct link
    }
  }
}
