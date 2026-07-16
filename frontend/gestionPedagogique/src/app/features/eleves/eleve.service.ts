import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { StatutUtilisateur } from '../../core/auth/auth.model';
import { Eleve } from './eleve.model';

interface EleveBackend {
  idEleve: number;
  idUtilisateur: number;
  email: string;
  numeroDossier: string;
  telephone: string | null;
  statut: StatutUtilisateur;
}

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/eleves';

  lister(): Observable<Eleve[]> {
    return this.http
      .get<EleveBackend[]>(this.baseUrl)
      .pipe(map((eleves) => eleves.map((eleve) => ({ ...eleve, id: eleve.idEleve }))));
  }

  consulter(id: number): Observable<Eleve> {
    return this.http
      .get<EleveBackend>(`${this.baseUrl}/${id}`)
      .pipe(map((eleve) => ({ ...eleve, id: eleve.idEleve })));
  }

  creer(requete: {
    email: string;
    motDePasse: string;
    numeroDossier: string;
    telephone: string | null;
    statut: StatutUtilisateur;
  }): Observable<Eleve> {
    return this.http
      .post<EleveBackend>(this.baseUrl, requete)
      .pipe(map((eleve) => ({ ...eleve, id: eleve.idEleve })));
  }

  modifier(
    id: number,
    requete: { email: string; numeroDossier: string; telephone: string | null; statut: StatutUtilisateur }
  ): Observable<Eleve> {
    return this.http
      .put<EleveBackend>(`${this.baseUrl}/${id}`, requete)
      .pipe(map((eleve) => ({ ...eleve, id: eleve.idEleve })));
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changerMotDePasse(id: number, motDePasse: string): Observable<Eleve> {
    return this.http
      .patch<EleveBackend>(`${this.baseUrl}/${id}/mot-de-passe`, { motDePasse })
      .pipe(map((eleve) => ({ ...eleve, id: eleve.idEleve })));
  }
}
