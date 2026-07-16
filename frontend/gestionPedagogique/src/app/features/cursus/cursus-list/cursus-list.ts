import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { Cursus } from '../../../core/models/cursus.model';
import { Filiere } from '../../../core/models/filiere.model';
import { CursusService } from '../../../core/services/cursus.service';
import { FiliereService } from '../../../core/services/filiere.service';

@Component({
  selector: 'app-cursus-list',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cursus-list.html'
})
export class CursusList implements OnInit {
  private readonly cursusService = inject(CursusService);
  private readonly filiereService = inject(FiliereService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  protected readonly cursus = signal<Cursus[]>([]);
  protected readonly filieres = signal<Filiere[]>([]);
  protected readonly recherche = signal('');
  protected readonly filtreFiliere = signal<number | null>(null);
  protected readonly displayedColumns = ['titre', 'filiere', 'niveau', 'actions'];
  protected readonly idEdition = signal<number | null>(null);
  protected readonly cursusFiltres = computed(() => {
    const recherche = this.recherche().trim().toLocaleLowerCase('fr');
    const idFiliere = this.filtreFiliere();
    return this.cursus().filter((element) => {
      const correspondRecherche = recherche
        ? `${element.titre} ${element.libelleFiliere} ${element.niveau ?? ''}`.toLocaleLowerCase('fr').includes(recherche)
        : true;
      const correspondFiliere = idFiliere == null || element.idFiliere === idFiliere;
      return correspondRecherche && correspondFiliere;
    });
  });

  protected readonly form = this.fb.group({
    idFiliere: [null as number | null, Validators.required],
    titre: ['', Validators.required],
    niveau: ['']
  });

  ngOnInit(): void {
    this.charger();
  }

  protected charger(): void {
    this.cursusService.lister().subscribe((cursus) => this.cursus.set(cursus));
    this.filiereService.lister().subscribe((filieres) => this.filieres.set(filieres));
  }

  protected rechercher(valeur: string): void {
    this.recherche.set(valeur);
  }

  protected filtrerFiliere(valeur: number | null): void {
    this.filtreFiliere.set(valeur);
  }

  protected editer(cursus: Cursus): void {
    this.idEdition.set(cursus.id);
    this.form.patchValue({
      idFiliere: cursus.idFiliere,
      titre: cursus.titre,
      niveau: cursus.niveau ?? ''
    });
  }

  protected annuler(): void {
    this.idEdition.set(null);
    this.form.reset({ idFiliere: null, titre: '', niveau: '' });
  }

  protected enregistrer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valeur = this.form.getRawValue();
    const requete = {
      idFiliere: valeur.idFiliere as number,
      titre: valeur.titre ?? '',
      niveau: valeur.niveau || null
    };
    const id = this.idEdition();
    const sauvegarde$ = id ? this.cursusService.modifier(id, requete) : this.cursusService.creer(requete);

    sauvegarde$.subscribe(() => {
      this.snackBar.open(id ? 'Cursus modifié.' : 'Cursus créé.', 'Fermer', { duration: 3000 });
      this.annuler();
      this.charger();
    });
  }
}
