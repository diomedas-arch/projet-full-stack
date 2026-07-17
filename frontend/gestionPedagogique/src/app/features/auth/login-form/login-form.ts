import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { ApiError } from '../../../core/http/api-error.model';
import { skipErrorNotification } from '../../../core/http/skip-error-notification';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly connexionEnCours = signal(false);
  protected readonly erreurBackend = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required]
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.erreurBackend.set(null));
  }

  protected connecter(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erreurBackend.set(null);
    this.connexionEnCours.set(true);
    const { email, motDePasse } = this.form.getRawValue();

    this.authService.login(email, motDePasse, skipErrorNotification()).subscribe({
      next: () => {
        this.connexionEnCours.set(false);
        this.router.navigateByUrl('/');
      },
      error: (erreur: ApiError) => {
        this.connexionEnCours.set(false);
        this.erreurBackend.set(erreur.message);
      }
    });
  }
}
