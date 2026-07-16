import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { libelleRole, libelleStatutUtilisateur } from '../../../core/auth/auth.model';
import { Utilisateur } from '../utilisateur.model';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-utilisateur-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './utilisateur-list.html'
})
export class UtilisateurList implements OnInit {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly utilisateurs = signal<Utilisateur[]>([]);
  protected readonly recherche = signal('');
  protected readonly displayedColumns = ['email', 'role', 'statut', 'actions'];
  protected readonly libelleRole = libelleRole;
  protected readonly libelleStatut = libelleStatutUtilisateur;
  protected readonly utilisateursFiltres = computed(() => {
    const recherche = this.recherche().trim().toLocaleLowerCase('fr');
    if (!recherche) {
      return this.utilisateurs();
    }

    return this.utilisateurs().filter((utilisateur) =>
      `${utilisateur.email} ${this.libelleRole(utilisateur.role)} ${this.libelleStatut(utilisateur.statut)}`
        .toLocaleLowerCase('fr')
        .includes(recherche)
    );
  });

  ngOnInit(): void {
    this.charger();
  }

  protected charger(): void {
    this.utilisateurService.lister().subscribe((utilisateurs) => this.utilisateurs.set(utilisateurs));
  }

  protected rechercher(valeur: string): void {
    this.recherche.set(valeur);
  }

  protected supprimer(utilisateur: Utilisateur): void {
    if (!confirm(`Supprimer ${utilisateur.email} ?`)) {
      return;
    }

    this.utilisateurService.supprimer(utilisateur.id).subscribe(() => {
      this.snackBar.open('Utilisateur supprimé.', 'Fermer', { duration: 3000 });
      this.charger();
    });
  }
}
