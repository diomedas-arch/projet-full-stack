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

import { StatutUtilisateur } from '../../../core/auth/auth.model';
import { EleveService } from '../eleve.service';

@Component({
  selector: 'app-eleve-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './eleve-form.html'
})
export class EleveForm {
  readonly id = input<string>();

  private readonly eleveService = inject(EleveService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly chargement = signal(false);
  protected readonly enregistrementEnCours = signal(false);
  protected readonly erreur = signal<string | null>(null);
  protected readonly statuts: StatutUtilisateur[] = ['ACTIF', 'INACTIF', 'BLOQUE'];

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: [''],
    numeroDossier: ['', Validators.required],
    telephone: [''],
    statut: ['ACTIF' as StatutUtilisateur, Validators.required]
  });

  constructor() {
    effect(() => {
      const idEleve = this.id();
      this.appliquerValidationMotDePasse(!!idEleve);
      if (!idEleve) {
        return;
      }

      this.chargement.set(true);
      this.eleveService.consulter(Number(idEleve)).subscribe({
        next: (eleve) => {
          this.form.patchValue({
            email: eleve.email,
            motDePasse: '',
            numeroDossier: eleve.numeroDossier,
            telephone: eleve.telephone ?? '',
            statut: eleve.statut
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
    const idEleve = this.id();
    const motDePasse = valeur.motDePasse.trim();
    let modificationPrincipaleTerminee = false;

    const sauvegarde$ = this.modeEdition()
      ? this.eleveService.modifier(Number(idEleve), {
          email: valeur.email,
          numeroDossier: valeur.numeroDossier,
          telephone: valeur.telephone || null,
          statut: valeur.statut
        }).pipe(
          tap(() => {
            modificationPrincipaleTerminee = true;
          }),
          concatMap((eleve) =>
            motDePasse ? this.eleveService.changerMotDePasse(Number(idEleve), motDePasse) : of(eleve)
          )
        )
      : this.eleveService.creer({
          email: valeur.email,
          motDePasse,
          numeroDossier: valeur.numeroDossier,
          telephone: valeur.telephone || null,
          statut: valeur.statut
        });

    sauvegarde$.subscribe({
      next: () => {
        this.snackBar.open(this.modeEdition() ? 'Élève modifié.' : 'Élève créé.', 'Fermer', {
          duration: 4000
        });
        this.router.navigate(['/eleves']);
      },
      error: (erreur) => {
        this.enregistrementEnCours.set(false);
        this.erreur.set(
          modificationPrincipaleTerminee && motDePasse
            ? `Le dossier élève a été enregistré, mais le changement de mot de passe a échoué : ${erreur.message}`
            : erreur.message ?? 'Enregistrement impossible.'
        );
      },
      complete: () => this.enregistrementEnCours.set(false)
    });
  }

  protected annuler(): void {
    this.router.navigate(['/eleves']);
  }

  private appliquerValidationMotDePasse(modeEdition: boolean): void {
    const controle = this.form.controls.motDePasse;
    controle.setValidators(modeEdition ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]);
    controle.updateValueAndValidity();
  }
}
