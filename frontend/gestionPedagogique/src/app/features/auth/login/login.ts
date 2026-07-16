import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly erreur = signal<string | null>(null);
  protected readonly succes = signal<string | null>(null);
  protected readonly chargement = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.auth.estConnecte()) {
      this.router.navigateByUrl(this.urlRetour());
      return;
    }

    if (this.route.snapshot.queryParamMap.get('session') === 'expiree') {
      this.erreur.set('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }

  protected connecter(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erreur.set(null);
    this.succes.set(null);
    this.chargement.set(true);
    const valeur = this.form.getRawValue();

    this.auth.login(valeur.email.trim(), valeur.motDePasse).subscribe({
      next: () => {
        this.chargement.set(false);
        this.succes.set('Connexion réussie. Redirection en cours…');
        this.router.navigateByUrl(this.urlRetour());
      },
      error: (erreur) => {
        this.chargement.set(false);
        this.erreur.set(erreur.message ?? 'Connexion impossible.');
      }
    });
  }

  private urlRetour(): string {
    const retour = this.route.snapshot.queryParamMap.get('returnUrl');
    return retour?.startsWith('/') && !retour.startsWith('//') ? retour : '/accueil';
  }
}
