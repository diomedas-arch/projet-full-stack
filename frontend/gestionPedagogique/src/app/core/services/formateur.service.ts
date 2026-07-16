import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FormateurDisponible } from '../models/formateur.model';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private readonly http = inject(HttpClient);

  lister(options: { actif?: boolean } = {}): Observable<FormateurDisponible[]> {
    const params =
      options.actif === undefined ? undefined : new HttpParams().set('actif', String(options.actif));
    return this.http.get<FormateurDisponible[]>('/api/formateurs', { params });
  }
}
