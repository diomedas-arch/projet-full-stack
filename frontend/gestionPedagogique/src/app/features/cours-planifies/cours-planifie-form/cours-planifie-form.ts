import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Component, OnInit, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiError } from '../../../core/http/api-error.model';
import { skipErrorNotification } from '../../../core/http/skip-error-notification';
import { Promotion } from '../../promotions/promotion.model';
import { PromotionService } from '../../promotions/promotion.service';
import { CoursPlanifieService } from '../cours-planifie.service';
import { CURSUS_COURS_TEMPORAIRE } from '../cursus-cours-temporaire.data';
import { FORMATEUR_TEMPORAIRE } from '../formateur-temporaire.data';

@Component({
  selector: 'app-cours-planifie-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cours-planifie-form.html',
  styleUrl: './cours-planifie-form.css'
})
export class CoursPlanifieForm implements OnInit {
  readonly id = input<string>();

  private readonly coursPlanifieService = inject(CoursPlanifieService);
  private readonly promotionService = inject(PromotionService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  private ignorerProchainResetCursusCours = false;

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly enregistrementEnCours = signal(false);
  protected readonly erreurGenerale = signal<string | null>(null);
  protected readonly dateFinErreurBackend = signal<string | null>(null);
  protected readonly coursErreurBackend = signal<string | null>(null);

  protected readonly promotions = signal<Promotion[]>([]);
  protected readonly cursusCoursTemporaire = CURSUS_COURS_TEMPORAIRE;
  protected readonly formateurTemporaire = FORMATEUR_TEMPORAIRE;

  protected readonly statuts = [
    { valeur: 'PLANIFIE', label: 'Planifié' },
    { valeur: 'EN_COURS', label: 'En cours' },
    { valeur: 'TERMINE', label: 'Terminé' },
    { valeur: 'ANNULE', label: 'Annulé' }
  ];

  protected readonly form = this.fb.nonNullable.group({
    idPromotion: [null as number | null, Validators.required],
    idCursusCours: [null as number | null, Validators.required],
    idFormateur: [null as number | null],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    salle: [''],
    statut: ['PLANIFIE', Validators.required]
  });

  private readonly idPromotionSignal = toSignal(this.form.controls.idPromotion.valueChanges, {
    initialValue: null
  });

  protected readonly cursusCoursDisponibles = computed(() => {
    const promotion = this.promotions().find((p) => p.id === this.idPromotionSignal());
    if (!promotion) {
      return [];
    }

    return this.cursusCoursTemporaire.filter((cc) => cc.idCursus === promotion.idCursus);
  });

  constructor() {
    effect(() => {
      const idValeur = this.id();
      if (idValeur) {
        this.ignorerProchainResetCursusCours = true;
        this.coursPlanifieService.consulter(Number(idValeur)).subscribe((coursPlanifie) => {
          this.form.patchValue({
            idPromotion: coursPlanifie.idPromotion,
            idCursusCours: coursPlanifie.idCursusCours,
            idFormateur: coursPlanifie.idFormateur,
            dateDebut: versDatetimeLocal(coursPlanifie.dateDebut),
            dateFin: versDatetimeLocal(coursPlanifie.dateFin),
            salle: coursPlanifie.salle,
            statut: coursPlanifie.statut
          });
        });
      }
    });

    this.form.controls.idPromotion.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.ignorerProchainResetCursusCours) {
        this.ignorerProchainResetCursusCours = false;
        return;
      }
      this.form.controls.idCursusCours.setValue(null);
    });

    this.form.controls.dateFin.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dateFinErreurBackend.set(null));

    this.form.controls.idCursusCours.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.coursErreurBackend.set(null));
  }

  ngOnInit(): void {
    this.promotionService.lister().subscribe((data) => this.promotions.set(data));
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erreurGenerale.set(null);
    this.dateFinErreurBackend.set(null);
    this.coursErreurBackend.set(null);
    this.enregistrementEnCours.set(true);

    const valeur = this.form.getRawValue();
    const requete = {
      idPromotion: valeur.idPromotion as number,
      idCursusCours: valeur.idCursusCours as number,
      idFormateur: valeur.idFormateur,
      dateDebut: valeur.dateDebut,
      dateFin: valeur.dateFin,
      salle: valeur.salle || null,
      statut: valeur.statut
    };
    const contexte = skipErrorNotification();

    const requete$ = this.modeEdition()
      ? this.coursPlanifieService.modifier(Number(this.id()), requete, contexte)
      : this.coursPlanifieService.creer(requete, contexte);

    requete$.subscribe({
      next: () => {
        this.enregistrementEnCours.set(false);
        this.snackBar.open(
          this.modeEdition() ? 'Cours planifié modifié.' : 'Cours planifié créé.',
          'Fermer',
          { duration: 4000 }
        );
        this.router.navigate(['/cours-planifies']);
      },
      error: (erreur: ApiError) => this.gererErreur(erreur)
    });
  }

  private gererErreur(erreur: ApiError): void {
    this.enregistrementEnCours.set(false);

    if (erreur.details && Object.keys(erreur.details).length > 0) {
      const messages = Object.values(erreur.details);
      this.erreurGenerale.set(messages.join(' '));
      return;
    }

    const message = erreur.message ?? '';
    if (message.includes('date de fin')) {
      this.dateFinErreurBackend.set(message);
    } else if (message.includes('même cursus')) {
      this.coursErreurBackend.set(message);
    } else {
      // Couvre notamment le doublon de couple promotion/cours du cursus,
      // qui n'est rattaché à aucun champ précis.
      this.erreurGenerale.set(message);
    }
  }

  protected annuler(): void {
    this.router.navigate(['/cours-planifies']);
  }
}

function versDatetimeLocal(valeur: string): string {
  return valeur.slice(0, 16);
}
