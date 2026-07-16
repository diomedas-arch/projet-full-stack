import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { libelleStatutUtilisateur } from '../../../core/auth/auth.model';
import { Eleve } from '../eleve.model';
import { EleveService } from '../eleve.service';

@Component({
  selector: 'app-eleve-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './eleve-list.html'
})
export class EleveList implements OnInit {
  private readonly eleveService = inject(EleveService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly eleves = signal<Eleve[]>([]);
  protected readonly recherche = signal('');
  protected readonly displayedColumns = ['email', 'numeroDossier', 'telephone', 'statut', 'actions'];
  protected readonly libelleStatut = libelleStatutUtilisateur;
  protected readonly elevesFiltres = computed(() => {
    const recherche = this.recherche().trim().toLocaleLowerCase('fr');
    if (!recherche) {
      return this.eleves();
    }

    return this.eleves().filter((eleve) =>
      `${eleve.numeroDossier} ${eleve.email} ${eleve.telephone ?? ''} ${this.libelleStatut(eleve.statut)}`
        .toLocaleLowerCase('fr')
        .includes(recherche)
    );
  });

  ngOnInit(): void {
    this.charger();
  }

  protected charger(): void {
    this.eleveService.lister().subscribe((eleves) => this.eleves.set(eleves));
  }

  protected rechercher(valeur: string): void {
    this.recherche.set(valeur);
  }

  protected supprimer(eleve: Eleve): void {
    if (!confirm(`Supprimer ${eleve.email} ?`)) {
      return;
    }

    this.eleveService.supprimer(eleve.id).subscribe(() => {
      this.snackBar.open('Élève supprimé.', 'Fermer', { duration: 3000 });
      this.charger();
    });
  }
}
