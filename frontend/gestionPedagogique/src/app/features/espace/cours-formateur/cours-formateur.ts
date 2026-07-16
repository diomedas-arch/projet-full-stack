import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { CoursFormateur, EspaceService } from '../espace.service';

@Component({
  selector: 'app-cours-formateur',
  imports: [DatePipe, MatTableModule],
  templateUrl: './cours-formateur.html'
})
export class CoursFormateurComponent implements OnInit {
  private readonly espaceService = inject(EspaceService);

  protected readonly cours = signal<CoursFormateur[]>([]);
  protected readonly displayedColumns = ['cours', 'promotion', 'date', 'salle', 'eleves'];

  ngOnInit(): void {
    this.espaceService.coursFormateur().subscribe((cours) => this.cours.set(cours));
  }
}
