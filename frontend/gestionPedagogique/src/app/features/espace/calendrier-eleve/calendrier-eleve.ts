import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { CalendrierEleve, EspaceService } from '../espace.service';

@Component({
  selector: 'app-calendrier-eleve',
  imports: [DatePipe, MatTableModule],
  templateUrl: './calendrier-eleve.html'
})
export class CalendrierEleveComponent implements OnInit {
  private readonly espaceService = inject(EspaceService);

  protected readonly cours = signal<CalendrierEleve[]>([]);
  protected readonly displayedColumns = ['type', 'promotion', 'cours', 'dateDebut', 'dateFin', 'salle', 'formateur'];

  ngOnInit(): void {
    this.espaceService.calendrierEleve().subscribe((cours) => this.cours.set(cours));
  }
}
