import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Promotion } from './promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/promotions';

  lister(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.baseUrl);
  }

  consulter(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.baseUrl}/${id}`);
  }

  creer(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.baseUrl, promotion);
  }

  modifier(id: number, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.baseUrl}/${id}`, promotion);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
