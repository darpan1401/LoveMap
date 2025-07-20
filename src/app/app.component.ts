import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { VersionCheckService } from './services/version-check.service'; // 🔧 Import version check service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showSplash = true;

  constructor(private versionCheck: VersionCheckService) {} // 🔧 Inject service

  ngOnInit() {
    // Show splash for 3 seconds
    setTimeout(() => {
      this.showSplash = false;

      // 🔁 After splash ends, check for app version
      this.versionCheck.checkVersion();
    }, 3000);
  }
}
