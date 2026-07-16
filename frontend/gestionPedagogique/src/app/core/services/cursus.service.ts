import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Cursus } from '../models/cursus.model';

// Service de lecture seule — consomme l'API Cursus existante (GET /api/cursus)
// pour les selects d'autres features. L'implémentation complète de la feature
// Cursus (création/édition) reste dans le périmètre de Sasha (features/cursus/).
@Injectable({
  providedIn: 'root'
})
export class CursusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cursus';

  lister(): Observable<Cursus[]> {
    return this.http.get<Cursus[]>(this.baseUrl);
  }
}
