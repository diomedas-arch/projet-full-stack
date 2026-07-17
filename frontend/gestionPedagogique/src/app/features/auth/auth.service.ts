import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { TokenStorageService } from '../../core/auth/token-storage.service';
import { LoginRequest, LoginResponse } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  readonly connecte = this.tokenStorage.estConnecte;

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
