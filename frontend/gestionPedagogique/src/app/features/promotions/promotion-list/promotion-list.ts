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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/confirm-dialog';
import { StatutBadge } from '../../../shared/ui/statut-badge/statut-badge';
import { Promotion } from '../promotion.model';
import { PromotionService } from '../promotion.service';

type FiltreStatut = 'TOUTES' | 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

@Component({
  selector: 'app-promotion-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    StatutBadge
  ],
  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.css'
})
export class PromotionList implements OnInit, AfterViewInit {
  private readonly promotionService = inject(PromotionService);
  protected readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sort = viewChild(MatSort);

  protected readonly displayedColumns = ['libelle', 'cursus', 'periode', 'statut', 'actions'];
  protected readonly promotions = signal<Promotion[]>([]);
  protected readonly filtreStatut = signal<FiltreStatut>('TOUTES');
  protected readonly dataSource = new MatTableDataSource<Promotion>([]);
  protected readonly peutGerer = computed(() => this.auth.aUnRole(['ROLE_ADMIN', 'ROLE_REFERENTE']));

  protected readonly filtres: { valeur: FiltreStatut; label: string }[] = [
    { valeur: 'TOUTES', label: 'Toutes' },
    { valeur: 'PLANIFIEE', label: 'Planifiées' },
    { valeur: 'EN_COURS', label: 'En cours' },
    { valeur: 'TERMINEE', label: 'Terminées' },
    { valeur: 'ANNULEE', label: 'Annulées' }
  ];

  protected readonly promotionsFiltrees = computed(() => {
    const filtre = this.filtreStatut();
    if (filtre === 'TOUTES') {
      return this.promotions();
    }

    return this.promotions().filter((p) => p.statut.toUpperCase() === filtre);
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.promotionsFiltrees();
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

  protected supprimer(promotion: Promotion): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titre: 'Supprimer cette promotion ?',
        message: `La promotion "${promotion.libelle}" sera définitivement supprimée.`
      }
    });

    dialogRef.afterClosed().subscribe((confirme) => {
      if (!confirme) {
        return;
      }

      this.promotionService.supprimer(promotion.id).subscribe({
        next: () => {
          this.snackBar.open('Promotion supprimée.', 'Fermer', { duration: 4000 });
          this.charger();
        }
      });
    });
  }

  private charger(): void {
    this.promotionService.lister().subscribe((data) => this.promotions.set(data));
  }
}
