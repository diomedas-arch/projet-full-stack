import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { TokenStorageService } from '../../core/auth/token-storage.service';
import { LoginRequest, LoginResponse } from './auth.model';

// Rôle exact exigé par SecurityConfig.java pour écrire sur /api/cours, /api/promotions
// et /api/cours-planifies : hasAuthority(ROLE_REFERENTE) uniquement (contrairement à
// /api/cursus et /api/filieres qui acceptent aussi ROLE_ADMIN — ce n'est PAS le cas ici).
const ROLE_ECRITURE_PEDAGOGIQUE = 'ROLE_REFERENTE';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  readonly connecte = this.tokenStorage.estConnecte;

  // Affichage uniquement (masquer/afficher des boutons) — la vraie protection reste
  // SecurityConfig côté backend, qui refuse déjà ces actions en 403 sans ce rôle.
  readonly peutEcrire = computed(() => this.tokenStorage.role() === ROLE_ECRITURE_PEDAGOGIQUE);

  login(email: string, motDePasse: string, context?: HttpContext): Observable<LoginResponse> {
    const requete: LoginRequest = { email, motDePasse };
    return this.http
      .post<LoginResponse>('/api/auth/login', requete, { context })
      .pipe(tap((reponse) => this.tokenStorage.ecrire(reponse.token)));
  }

  logout(): void {
    this.tokenStorage.effacer();
  }
}
