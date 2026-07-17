import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly connecte = this.authService.connecte;

  protected readonly liens = [
    { path: '/cours', label: 'Cours' },
    { path: '/promotions', label: 'Promotions' },
    { path: '/cours-planifies', label: 'Cours planifiés' }
  ];

  protected deconnecter(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
