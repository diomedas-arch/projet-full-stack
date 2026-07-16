import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { Filiere } from '../../../core/models/filiere.model';
import { FiliereService } from '../../../core/services/filiere.service';

@Component({
  selector: 'app-filiere-list',
  imports: [ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './filiere-list.html'
})
export class FiliereList implements OnInit {
  private readonly filiereService = inject(FiliereService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly filieres = signal<Filiere[]>([]);
  protected readonly recherche = signal('');
  protected readonly displayedColumns = ['libelle', 'nombreCursus', 'actions'];
  protected readonly idEdition = signal<number | null>(null);
  protected readonly filieresFiltrees = computed(() => {
    const recherche = this.recherche().trim().toLocaleLowerCase('fr');
    return recherche
      ? this.filieres().filter((filiere) => filiere.libelle.toLocaleLowerCase('fr').includes(recherche))
      : this.filieres();
  });

  protected readonly form = this.fb.nonNullable.group({
    libelle: ['', Validators.required]
  });

  ngOnInit(): void {
    this.charger();
  }

  protected charger(): void {
    this.filiereService.lister().subscribe((filieres) => this.filieres.set(filieres));
  }

  protected rechercher(valeur: string): void {
    this.recherche.set(valeur);
  }

  protected editer(filiere: Filiere): void {
    this.idEdition.set(filiere.id);
    this.form.patchValue({ libelle: filiere.libelle });
  }

  protected annuler(): void {
    this.idEdition.set(null);
    this.form.reset({ libelle: '' });
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const requete = this.form.getRawValue();
    const id = this.idEdition();
    const sauvegarde$ = id ? this.filiereService.modifier(id, requete) : this.filiereService.creer(requete);

    sauvegarde$.subscribe(() => {
      this.snackBar.open(id ? 'Filière modifiée.' : 'Filière créée.', 'Fermer', { duration: 3000 });
      this.annuler();
      this.charger();
    });
  }
}
