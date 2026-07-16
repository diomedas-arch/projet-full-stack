import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CoursPlanifie } from './cours-planifie.model';

export interface CoursPlanifieRequest {
  idPromotion: number;
  idCursusCours: number;
  idFormateur: number | null;
  dateDebut: string;
  dateFin: string;
  salle: string | null;
  statut: string;
}

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

  creer(coursPlanifie: CoursPlanifieRequest, context?: HttpContext): Observable<CoursPlanifie> {
    return this.http.post<CoursPlanifie>(this.baseUrl, coursPlanifie, { context });
  }

  modifier(
    id: number,
    coursPlanifie: CoursPlanifieRequest,
    context?: HttpContext
  ): Observable<CoursPlanifie> {
    return this.http.put<CoursPlanifie>(`${this.baseUrl}/${id}`, coursPlanifie, { context });
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
