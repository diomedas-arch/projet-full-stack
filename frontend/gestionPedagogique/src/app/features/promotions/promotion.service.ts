import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Promotion, PromotionDetailData } from './promotion.model';

export interface PromotionRequest {
  idCursus: number;
  libelle: string;
  periode: string;
  statut: string;
}

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

  consulterDetail(id: number): Observable<PromotionDetailData> {
    return this.http.get<PromotionDetailData>(`${this.baseUrl}/${id}/detail`);
  }

  creer(promotion: PromotionRequest, context?: HttpContext): Observable<Promotion> {
    return this.http.post<Promotion>(this.baseUrl, promotion, { context });
  }

  modifier(id: number, promotion: PromotionRequest, context?: HttpContext): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.baseUrl}/${id}`, promotion, { context });
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
