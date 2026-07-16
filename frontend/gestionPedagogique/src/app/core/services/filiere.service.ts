import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Filiere } from '../models/filiere.model';

interface FiliereBackend {
  idFiliere: number;
  libelle: string;
  nombreCursus: number;
}

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/filieres';

  lister(): Observable<Filiere[]> {
    return this.http.get<FiliereBackend[]>(this.baseUrl).pipe(
      map((filieres) => filieres.map((filiere) => ({ ...filiere, id: filiere.idFiliere })))
    );
  }

  consulter(id: number): Observable<Filiere> {
    return this.http
      .get<FiliereBackend>(`${this.baseUrl}/${id}`)
      .pipe(map((filiere) => ({ ...filiere, id: filiere.idFiliere })));
  }

  creer(requete: { libelle: string }): Observable<Filiere> {
    return this.http
      .post<FiliereBackend>(this.baseUrl, requete)
      .pipe(map((filiere) => ({ ...filiere, id: filiere.idFiliere })));
  }

  modifier(id: number, requete: { libelle: string }): Observable<Filiere> {
    return this.http
      .put<FiliereBackend>(`${this.baseUrl}/${id}`, requete)
      .pipe(map((filiere) => ({ ...filiere, id: filiere.idFiliere })));
  }
}
