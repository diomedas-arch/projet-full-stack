import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { ApiError } from '../../../core/http/api-error.model';
import { skipErrorNotification } from '../../../core/http/skip-error-notification';
import { CursusCours } from '../../../core/models/cursus-cours.model';
import { FormateurDisponible } from '../../../core/models/formateur.model';
import { CursusCoursService } from '../../../core/services/cursus-cours.service';
import { FormateurService } from '../../../core/services/formateur.service';
import { Promotion } from '../../promotions/promotion.model';
import { PromotionService } from '../../promotions/promotion.service';
import { CoursPlanifie } from '../cours-planifie.model';
import { CoursPlanifieRequest, CoursPlanifieService } from '../cours-planifie.service';

@Component({
  selector: 'app-cours-planifie-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
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
  private readonly cursusCoursService = inject(CursusCoursService);
  private readonly formateurService = inject(FormateurService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly modeEdition = computed(() => !!this.id());
  protected readonly chargementInitial = signal(false);
  protected readonly chargementCours = signal(false);
  protected readonly enregistrementEnCours = signal(false);
  protected readonly erreurGenerale = signal<string | null>(null);
  protected readonly erreurCours = signal<string | null>(null);
  protected readonly dateFinErreurBackend = signal<string | null>(null);

  protected readonly promotions = signal<Promotion[]>([]);
  protected readonly cursusCoursDisponibles = signal<CursusCours[]>([]);
  protected readonly formateurs = signal<FormateurDisponible[]>([]);

  protected readonly statuts = [
    { valeur: 'PLANIFIE', label: 'Planifié' },
    { valeur: 'EN_COURS', label: 'En cours' },
    { valeur: 'TERMINE', label: 'Terminé' },
    { valeur: 'ANNULE', label: 'Annulé' }
  ];

  protected readonly form = this.fb.group({
    idPromotion: [null as number | null, Validators.required],
    idCursusCours: [null as number | null, Validators.required],
    idFormateur: [null as number | null],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    salle: [''],
    statut: ['PLANIFIE', Validators.required]
  });

  constructor() {
    this.form.controls.idPromotion.valueChanges.pipe(takeUntilDestroyed()).subscribe((idPromotion) => {
      this.chargerCoursPourPromotion(idPromotion, true);
    });

    this.form.controls.dateFin.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dateFinErreurBackend.set(null));

    this.form.controls.idCursusCours.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erreurCours.set(null));
  }

  ngOnInit(): void {
    this.chargementInitial.set(true);
    const idCoursPlanifie = this.id();

    forkJoin({
      promotions: this.promotionService.lister(),
      formateurs: this.formateurService.lister({ actif: true }),
      coursPlanifie: idCoursPlanifie ? this.coursPlanifieService.consulter(Number(idCoursPlanifie)) : of(null)
    }).subscribe({
      next: ({ promotions, formateurs, coursPlanifie }) => {
        this.promotions.set(promotions);
        this.formateurs.set(formateurs);
        if (coursPlanifie) {
          this.appliquerCoursPlanifie(coursPlanifie);
        }
      },
      error: (erreur: ApiError) => this.erreurGenerale.set(erreur.message),
      complete: () => this.chargementInitial.set(false)
    });
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erreurGenerale.set(null);
    this.dateFinErreurBackend.set(null);
    this.erreurCours.set(null);
    this.enregistrementEnCours.set(true);

    const valeur = this.form.getRawValue();
    const requete: CoursPlanifieRequest = {
      idPromotion: valeur.idPromotion as number,
      idCursusCours: valeur.idCursusCours as number,
      idFormateur: valeur.idFormateur ?? null,
      dateDebut: valeur.dateDebut ?? '',
      dateFin: valeur.dateFin ?? '',
      salle: valeur.salle?.trim() || null,
      statut: valeur.statut ?? 'PLANIFIE'
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

  protected annuler(): void {
    this.router.navigate(['/cours-planifies']);
  }

  protected libelleFormateur(formateur: FormateurDisponible): string {
    const email = formateur.email ?? 'Sans compte utilisateur';
    return formateur.specialite ? `${email} - ${formateur.specialite}` : email;
  }

  private appliquerCoursPlanifie(coursPlanifie: CoursPlanifie): void {
    this.form.patchValue(
      {
        idPromotion: coursPlanifie.idPromotion,
        idCursusCours: null,
        idFormateur: coursPlanifie.idFormateur,
        dateDebut: versDatetimeLocal(coursPlanifie.dateDebut),
        dateFin: versDatetimeLocal(coursPlanifie.dateFin),
        salle: coursPlanifie.salle ?? '',
        statut: coursPlanifie.statut
      },
      { emitEvent: false }
    );
    this.chargerCoursPourPromotion(coursPlanifie.idPromotion, false, coursPlanifie.idCursusCours);
  }

  private chargerCoursPourPromotion(
    idPromotion: number | null,
    resetSelection: boolean,
    selectionApresChargement: number | null = null
  ): void {
    if (resetSelection) {
      this.form.controls.idCursusCours.setValue(null, { emitEvent: false });
    }

    const promotion = this.promotions().find((element) => element.id === idPromotion);
    if (!promotion) {
      this.cursusCoursDisponibles.set([]);
      return;
    }

    this.chargementCours.set(true);
    this.erreurCours.set(null);
    this.cursusCoursService.listerParCursus(promotion.idCursus).subscribe({
      next: (cours) => {
        this.cursusCoursDisponibles.set(cours);
        if (selectionApresChargement != null) {
          this.form.controls.idCursusCours.setValue(selectionApresChargement, { emitEvent: false });
        }
      },
      error: (erreur: ApiError) => {
        this.cursusCoursDisponibles.set([]);
        this.erreurCours.set(erreur.message);
      },
      complete: () => this.chargementCours.set(false)
    });
  }

  private gererErreur(erreur: ApiError): void {
    this.enregistrementEnCours.set(false);

    if (erreur.details && Object.keys(erreur.details).length > 0) {
      this.erreurGenerale.set(Object.values(erreur.details).join(' '));
      return;
    }

    const message = erreur.message ?? '';
    if (message.includes('date de fin')) {
      this.dateFinErreurBackend.set(message);
    } else if (message.includes('cursus') || message.includes('planifié')) {
      this.erreurCours.set(message);
    } else {
      this.erreurGenerale.set(message);
    }
  }
}

function versDatetimeLocal(valeur: string): string {
  return valeur.slice(0, 16);
}
