import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RoleUtilisateur, StatutUtilisateur } from '../../core/auth/auth.model';
import { Utilisateur } from './utilisateur.model';

interface UtilisateurBackend {
  idUtilisateur: number;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/utilisateurs';

  lister(): Observable<Utilisateur[]> {
    return this.http.get<UtilisateurBackend[]>(this.baseUrl).pipe(
      map((utilisateurs) => utilisateurs.map((utilisateur) => ({ ...utilisateur, id: utilisateur.idUtilisateur })))
    );
  }

  consulter(id: number): Observable<Utilisateur> {
    return this.http
      .get<UtilisateurBackend>(`${this.baseUrl}/${id}`)
      .pipe(map((utilisateur) => ({ ...utilisateur, id: utilisateur.idUtilisateur })));
  }

  creer(requete: {
    email: string;
    motDePasse: string;
    role: RoleUtilisateur;
    statut: StatutUtilisateur;
  }): Observable<Utilisateur> {
    return this.http
      .post<UtilisateurBackend>(this.baseUrl, requete)
      .pipe(map((utilisateur) => ({ ...utilisateur, id: utilisateur.idUtilisateur })));
  }

  modifier(
    id: number,
    requete: { email: string; role: RoleUtilisateur; statut: StatutUtilisateur }
  ): Observable<Utilisateur> {
    return this.http
      .put<UtilisateurBackend>(`${this.baseUrl}/${id}`, requete)
      .pipe(map((utilisateur) => ({ ...utilisateur, id: utilisateur.idUtilisateur })));
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changerMotDePasse(id: number, motDePasse: string): Observable<Utilisateur> {
    return this.http
      .patch<UtilisateurBackend>(`${this.baseUrl}/${id}/mot-de-passe`, { motDePasse })
      .pipe(map((utilisateur) => ({ ...utilisateur, id: utilisateur.idUtilisateur })));
  }
}
