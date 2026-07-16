import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { Cours } from '../cours.model';
import { CoursService } from '../cours.service';

@Component({
  selector: 'app-cours-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './cours-detail.html',
  styleUrl: './cours-detail.css',
})
export class CoursDetail {
  readonly id = input<string>();

  private readonly coursService = inject(CoursService);

  protected readonly cours = signal<Cours | null>(null);
  protected readonly chargement = signal(true);
  protected readonly introuvable = signal(false);

  constructor() {
    effect(() => {
      const idCours = this.id();
      if (!idCours) {
        return;
      }

      this.chargement.set(true);
      this.introuvable.set(false);

      this.coursService.consulter(Number(idCours)).subscribe({
        next: (cours) => this.cours.set(cours),
        error: () => {
          this.cours.set(null);
          this.introuvable.set(true);
          this.chargement.set(false);
        },
        complete: () => this.chargement.set(false)
      });
    });
  }
}
