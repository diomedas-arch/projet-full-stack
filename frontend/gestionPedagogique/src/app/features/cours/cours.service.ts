import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Cours } from './cours.model';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cours';

  lister(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.baseUrl);
  }

  consulter(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.baseUrl}/${id}`);
  }

  creer(cours: Cours): Observable<Cours> {
    return this.http.post<Cours>(this.baseUrl, cours);
  }

  modifier(id: number, cours: Cours): Observable<Cours> {
    return this.http.put<Cours>(`${this.baseUrl}/${id}`, cours);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
