import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiError } from '../../../core/http/api-error.model';
import { skipErrorNotification } from '../../../core/http/skip-error-notification';
import { CoursService } from '../cours.service';

@Component({
  selector: 'app-cours-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cours-form.html',
  styleUrl: './cours-form.css'
})
export class CoursForm {
  readonly id = input<string>();

  private readonly coursService = inject(CoursService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly enregistrementEnCours = signal(false);
  protected readonly codeErreurBackend = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    titre: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const idValeur = this.id();
      if (idValeur) {
        this.coursService.consulter(Number(idValeur)).subscribe((cours) => {
          this.form.patchValue(cours);
        });
      }
    });

    this.form.controls.code.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.codeErreurBackend.set(null));
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.codeErreurBackend.set(null);
    this.enregistrementEnCours.set(true);
    const valeur = this.form.getRawValue();
    const contexte = skipErrorNotification();

    const requete$ = this.modeEdition()
      ? this.coursService.modifier(Number(this.id()), valeur, contexte)
      : this.coursService.creer(valeur, contexte);

    requete$.subscribe({
      next: () => {
        this.enregistrementEnCours.set(false);
        this.snackBar.open(this.modeEdition() ? 'Cours modifié.' : 'Cours créé.', 'Fermer', {
          duration: 4000
        });
        this.router.navigate(['/cours']);
      },
      error: (erreur: ApiError) => {
        this.enregistrementEnCours.set(false);
        this.codeErreurBackend.set(erreur.details?.['code'] ?? erreur.message);
      }
    });
  }

  protected annuler(): void {
    this.router.navigate(['/cours']);
  }
}
