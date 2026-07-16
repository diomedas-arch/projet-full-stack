import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concatMap, of, tap } from 'rxjs';

import { RoleUtilisateur, StatutUtilisateur } from '../../../core/auth/auth.model';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-utilisateur-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './utilisateur-form.html'
})
export class UtilisateurForm {
  readonly id = input<string>();

  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly chargement = signal(false);
  protected readonly enregistrementEnCours = signal(false);
  protected readonly erreur = signal<string | null>(null);

  protected readonly roles: RoleUtilisateur[] = ['ROLE_ADMIN', 'ROLE_REFERENTE', 'ROLE_FORMATEUR', 'ROLE_ELEVE'];
  protected readonly statuts: StatutUtilisateur[] = ['ACTIF', 'INACTIF', 'BLOQUE'];

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: [''],
    role: ['ROLE_ELEVE' as RoleUtilisateur, Validators.required],
    statut: ['ACTIF' as StatutUtilisateur, Validators.required]
  });

  constructor() {
    effect(() => {
      const idUtilisateur = this.id();
      this.appliquerValidationMotDePasse(!!idUtilisateur);
      if (!idUtilisateur) {
        return;
      }

      this.chargement.set(true);
      this.utilisateurService.consulter(Number(idUtilisateur)).subscribe({
        next: (utilisateur) => {
          this.form.patchValue({
            email: utilisateur.email,
            motDePasse: '',
            role: utilisateur.role,
            statut: utilisateur.statut
          });
        },
        complete: () => this.chargement.set(false),
        error: () => this.chargement.set(false)
      });
    });
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enregistrementEnCours.set(true);
    this.erreur.set(null);
    const valeur = this.form.getRawValue();
    const idUtilisateur = this.id();
    const motDePasse = valeur.motDePasse.trim();
    let modificationPrincipaleTerminee = false;

    const sauvegarde$ = this.modeEdition()
      ? this.utilisateurService.modifier(Number(idUtilisateur), {
          email: valeur.email,
          role: valeur.role,
          statut: valeur.statut
        }).pipe(
          tap(() => {
            modificationPrincipaleTerminee = true;
          }),
          concatMap((utilisateur) =>
            motDePasse ? this.utilisateurService.changerMotDePasse(Number(idUtilisateur), motDePasse) : of(utilisateur)
          )
        )
      : this.utilisateurService.creer({
          email: valeur.email,
          motDePasse,
          role: valeur.role,
          statut: valeur.statut
        });

    sauvegarde$.subscribe({
      next: () => {
        this.snackBar.open(this.modeEdition() ? 'Utilisateur modifié.' : 'Utilisateur créé.', 'Fermer', {
          duration: 4000
        });
        this.router.navigate(['/utilisateurs']);
      },
      error: (erreur) => {
        this.enregistrementEnCours.set(false);
        this.erreur.set(
          modificationPrincipaleTerminee && motDePasse
            ? `Les informations principales ont été enregistrées, mais le changement de mot de passe a échoué : ${erreur.message}`
            : erreur.message ?? 'Enregistrement impossible.'
        );
      },
      complete: () => this.enregistrementEnCours.set(false)
    });
  }

  protected annuler(): void {
    this.router.navigate(['/utilisateurs']);
  }

  private appliquerValidationMotDePasse(modeEdition: boolean): void {
    const controle = this.form.controls.motDePasse;
    controle.setValidators(modeEdition ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]);
    controle.updateValueAndValidity();
  }
}
