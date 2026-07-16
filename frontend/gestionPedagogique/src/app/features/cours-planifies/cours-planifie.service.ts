import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CoursPlanifie } from './cours-planifie.model';

@Injectable({
  providedIn: 'root'
})
export class CoursPlanifieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cours-planifies';

  lister(): Observable<CoursPlanifie[]> {
    return this.http.get<CoursPlanifie[]>(this.baseUrl);
  }

  consulter(id: number): Observable<CoursPlanifie> {
    return this.http.get<CoursPlanifie>(`${this.baseUrl}/${id}`);
  }

  creer(coursPlanifie: CoursPlanifie): Observable<CoursPlanifie> {
    return this.http.post<CoursPlanifie>(this.baseUrl, coursPlanifie);
  }

  modifier(id: number, coursPlanifie: CoursPlanifie): Observable<CoursPlanifie> {
    return this.http.put<CoursPlanifie>(`${this.baseUrl}/${id}`, coursPlanifie);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  findByPromotion(idPromotion: number): Observable<CoursPlanifie[]> {
    return this.http.get<CoursPlanifie[]>(`${this.baseUrl}/promotion/${idPromotion}`);
  }

  findByFormateur(idFormateur: number): Observable<CoursPlanifie[]> {
    return this.http.get<CoursPlanifie[]>(`${this.baseUrl}/formateur/${idFormateur}`);
  }
}
