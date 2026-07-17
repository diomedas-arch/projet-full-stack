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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/confirm-dialog';
import { Cours } from '../cours.model';
import { CoursService } from '../cours.service';

@Component({
  selector: 'app-cours-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './cours-list.html',
  styleUrl: './cours-list.css'
})
export class CoursList implements OnInit, AfterViewInit {
  private readonly coursService = inject(CoursService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sort = viewChild(MatSort);

  protected readonly displayedColumns = ['code', 'titre', 'actions'];
  protected readonly cours = signal<Cours[]>([]);
  protected readonly recherche = signal('');
  protected readonly dataSource = new MatTableDataSource<Cours>([]);

  protected readonly coursFiltres = computed(() => {
    const terme = this.recherche().trim().toLowerCase();
    if (!terme) {
      return this.cours();
    }

    return this.cours().filter(
      (c) => c.code.toLowerCase().includes(terme) || c.titre.toLowerCase().includes(terme)
    );
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.coursFiltres();
    });
  }

  ngOnInit(): void {
    this.charger();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort() ?? null;
  }

  protected onRecherche(valeur: string): void {
    this.recherche.set(valeur);
  }

  protected supprimer(cours: Cours): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titre: 'Supprimer ce cours ?',
        message: `Le cours "${cours.titre}" (${cours.code}) sera définitivement supprimé.`
      }
    });

    dialogRef.afterClosed().subscribe((confirme) => {
      if (!confirme) {
        return;
      }

      this.coursService.supprimer(cours.idCours).subscribe({
        next: () => {
          this.snackBar.open('Cours supprimé.', 'Fermer', { duration: 4000 });
          this.charger();
        }
      });
    });
  }

  private charger(): void {
    this.coursService.lister().subscribe((data) => this.cours.set(data));
  }
}
