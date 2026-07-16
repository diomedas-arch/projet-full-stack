import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly liens = [
    { path: '/cours', label: 'Cours' },
    { path: '/promotions', label: 'Promotions' },
    { path: '/cours-planifies', label: 'Cours planifiés' }
  ];
}
