import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Add this line
  imports: [RouterOutlet, SplashScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showSplash = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 3000); 
  }
}