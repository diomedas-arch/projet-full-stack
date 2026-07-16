import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CalendrierEleve {
  typeInscription: 'PROMOTION' | 'UNITE';
  idCoursPlanifie: number;
  promotion: string;
  codeCours: string;
  titreCours: string;
  dateDebut: string;
  dateFin: string;
  salle: string | null;
  formateur: string | null;
}

export interface EleveConcerne {
  idEleve: number;
  email: string;
  numeroDossier: string;
  telephone: string | null;
}

export interface CoursFormateur {
  cours: {
    idCoursPlanifie: number;
    promotion: string;
    codeCours: string;
    titreCours: string;
    dateDebut: string;
    dateFin: string;
    salle: string | null;
    statut: string;
  };
  eleves: EleveConcerne[];
}

@Injectable({
  providedIn: 'root'
})
export class EspaceService {
  private readonly http = inject(HttpClient);

  calendrierEleve(): Observable<CalendrierEleve[]> {
    return this.http.get<CalendrierEleve[]>('/api/me/calendrier');
  }

  coursFormateur(): Observable<CoursFormateur[]> {
    return this.http.get<CoursFormateur[]>('/api/formateur/cours');
  }
}
