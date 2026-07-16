import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Cursus } from '../models/cursus.model';

interface CursusBackend {
  idCursus: number;
  titre: string;
  niveau: string | null;
  idFiliere: number;
  libelleFiliere: string;
}

@Injectable({
  providedIn: 'root'
})
export class CursusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cursus';

  lister(): Observable<Cursus[]> {
    return this.http.get<CursusBackend[]>(this.baseUrl).pipe(
      map((cursus) => cursus.map((element) => ({ ...element, id: element.idCursus })))
    );
  }

  consulter(id: number): Observable<Cursus> {
    return this.http
      .get<CursusBackend>(`${this.baseUrl}/${id}`)
      .pipe(map((cursus) => ({ ...cursus, id: cursus.idCursus })));
  }

  creer(requete: { idFiliere: number; titre: string; niveau: string | null }): Observable<Cursus> {
    return this.http
      .post<CursusBackend>(this.baseUrl, requete)
      .pipe(map((cursus) => ({ ...cursus, id: cursus.idCursus })));
  }

  modifier(id: number, requete: { idFiliere: number; titre: string; niveau: string | null }): Observable<Cursus> {
    return this.http
      .put<CursusBackend>(`${this.baseUrl}/${id}`, requete)
      .pipe(map((cursus) => ({ ...cursus, id: cursus.idCursus })));
  }
}
