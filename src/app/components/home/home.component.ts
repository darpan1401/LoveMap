import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }

  async ngOnInit() {
    // Check if profile exists (extra protection)
    const profileExists = await this.userService.checkProfileStatus();
    if (!profileExists) {
      this.router.navigate(['/profile-setup']);
    }
  }
}
