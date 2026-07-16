import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CursusCours } from '../models/cursus-cours.model';

@Injectable({
  providedIn: 'root'
})
export class CursusCoursService {
  private readonly http = inject(HttpClient);

  listerParCursus(idCursus: number): Observable<CursusCours[]> {
    return this.http.get<CursusCours[]>(`/api/cursus/${idCursus}/cours`);
  }
}
