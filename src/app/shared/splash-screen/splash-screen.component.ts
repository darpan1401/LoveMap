import { AfterViewInit, Component, OnInit } from '@angular/core';

declare var gsap: any;

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    setTimeout(() => {
      const splash = document.querySelector('.splash-wrapper') as HTMLElement;
      if (splash) {
        gsap.to(splash, {
          opacity: 0,
          duration: 1,
          onComplete: () => splash.style.display = 'none'
        });
      }
    }, 3000); // 4 seconds duration
  }

  ngAfterViewInit(): void {
    
  }
}
