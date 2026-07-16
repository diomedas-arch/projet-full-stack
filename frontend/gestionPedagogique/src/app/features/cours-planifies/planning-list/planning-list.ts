import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/confirm-dialog';
import { StatutBadge } from '../../../shared/ui/statut-badge/statut-badge';
import { CoursPlanifie } from '../cours-planifie.model';
import { CoursPlanifieService } from '../cours-planifie.service';

type FiltreStatut = 'TOUS' | 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

@Component({
  selector: 'app-planning-list',
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    StatutBadge
  ],
  templateUrl: './planning-list.html',
  styleUrl: './planning-list.css'
})
export class PlanningList implements OnInit, AfterViewInit {
  private readonly coursPlanifieService = inject(CoursPlanifieService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sort = viewChild(MatSort);

  protected readonly displayedColumns = [
    'cours',
    'promotion',
    'formateur',
    'dateDebut',
    'dateFin',
    'salle',
    'statut',
    'actions'
  ];

  protected readonly coursPlanifies = signal<CoursPlanifie[]>([]);
  protected readonly filtreStatut = signal<FiltreStatut>('TOUS');
  protected readonly sansFormateurSeulement = signal(false);
  protected readonly dataSource = new MatTableDataSource<CoursPlanifie>([]);

  protected readonly filtres: { valeur: FiltreStatut; label: string }[] = [
    { valeur: 'TOUS', label: 'Tous' },
    { valeur: 'PLANIFIE', label: 'Planifiés' },
    { valeur: 'EN_COURS', label: 'En cours' },
    { valeur: 'TERMINE', label: 'Terminés' },
    { valeur: 'ANNULE', label: 'Annulés' }
  ];

  protected readonly coursPlanifiesFiltres = computed(() => {
    let liste = this.coursPlanifies();

    const filtre = this.filtreStatut();
    if (filtre !== 'TOUS') {
      liste = liste.filter((c) => c.statut.toUpperCase() === filtre);
    }

    if (this.sansFormateurSeulement()) {
      liste = liste.filter((c) => c.idFormateur == null);
    }

    return liste;
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.coursPlanifiesFiltres();
    });
  }

  ngOnInit(): void {
    this.charger();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort() ?? null;
  }

  protected onFiltreChange(event: MatChipListboxChange): void {
    this.filtreStatut.set(event.value as FiltreStatut);
  }

  protected onSansFormateurChange(actif: boolean): void {
    this.sansFormateurSeulement.set(actif);
  }

  protected supprimer(coursPlanifie: CoursPlanifie): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titre: 'Supprimer ce cours planifié ?',
        message: `"${coursPlanifie.titreCours}" pour la promotion "${coursPlanifie.libellePromotion}" sera définitivement supprimé.`
      }
    });

    dialogRef.afterClosed().subscribe((confirme) => {
      if (!confirme) {
        return;
      }

      this.coursPlanifieService.supprimer(coursPlanifie.id).subscribe({
        next: () => {
          this.snackBar.open('Cours planifié supprimé.', 'Fermer', { duration: 4000 });
          this.charger();
        }
      });
    });
  }

  private charger(): void {
    this.coursPlanifieService.lister().subscribe((data) => this.coursPlanifies.set(data));
  }
}
