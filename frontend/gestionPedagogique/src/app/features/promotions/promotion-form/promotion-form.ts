import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, OnInit, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiError } from '../../../core/http/api-error.model';
import { skipErrorNotification } from '../../../core/http/skip-error-notification';
import { Cursus } from '../../../core/models/cursus.model';
import { CursusService } from '../../../core/services/cursus.service';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.css'
})
export class PromotionForm implements OnInit {
  readonly id = input<string>();

  private readonly promotionService = inject(PromotionService);
  private readonly cursusService = inject(CursusService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly enregistrementEnCours = signal(false);
  protected readonly libelleErreurBackend = signal<string | null>(null);
  protected readonly cursusListe = signal<Cursus[]>([]);

  protected readonly statuts = [
    { valeur: 'PLANIFIEE', label: 'Planifiée' },
    { valeur: 'EN_COURS', label: 'En cours' },
    { valeur: 'TERMINEE', label: 'Terminée' },
    { valeur: 'ANNULEE', label: 'Annulée' }
  ];

  protected readonly form = this.fb.nonNullable.group({
    idCursus: [null as number | null, Validators.required],
    libelle: ['', Validators.required],
    periode: ['', Validators.required],
    statut: ['PLANIFIEE', Validators.required]
  });

  constructor() {
    effect(() => {
      const idValeur = this.id();
      if (idValeur) {
        this.promotionService.consulter(Number(idValeur)).subscribe((promotion) => {
          this.form.patchValue(promotion);
        });
      }
    });

    this.form.controls.libelle.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.libelleErreurBackend.set(null));
  }

  ngOnInit(): void {
    this.cursusService.lister().subscribe((data) => this.cursusListe.set(data));
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.libelleErreurBackend.set(null);
    this.enregistrementEnCours.set(true);
    const valeur = this.form.getRawValue();
    const requete = {
      idCursus: valeur.idCursus as number,
      libelle: valeur.libelle,
      periode: valeur.periode,
      statut: valeur.statut
    };
    const contexte = skipErrorNotification();

    const requete$ = this.modeEdition()
      ? this.promotionService.modifier(Number(this.id()), requete, contexte)
      : this.promotionService.creer(requete, contexte);

    requete$.subscribe({
      next: () => {
        this.enregistrementEnCours.set(false);
        this.snackBar.open(this.modeEdition() ? 'Promotion modifiée.' : 'Promotion créée.', 'Fermer', {
          duration: 4000
        });
        this.router.navigate(['/promotions']);
      },
      error: (erreur: ApiError) => {
        this.enregistrementEnCours.set(false);

        const detailLibelle = erreur.details?.['libelle'];
        const pasDeDetails = !erreur.details || Object.keys(erreur.details).length === 0;

        // Le backend renvoie pour l'instant du 400 sur un libellé en doublon
        // (harmonisation vers 409 prévue) : les deux codes sont traités comme
        // une erreur de validation affichée sur le champ libellé.
        if (detailLibelle || ((erreur.status === 400 || erreur.status === 409) && pasDeDetails)) {
          this.libelleErreurBackend.set(detailLibelle ?? erreur.message);
          return;
        }

        this.snackBar.open(erreur.message, 'Fermer', { duration: 6000, panelClass: 'snackbar-error' });
      }
    });
  }

  protected annuler(): void {
    this.router.navigate(['/promotions']);
  }
}
