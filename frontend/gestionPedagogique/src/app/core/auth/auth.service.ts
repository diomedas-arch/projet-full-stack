import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { LoginResponse, RoleUtilisateur, UtilisateurSession } from './auth.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionInitiale = lireSessionStockee();
  private readonly utilisateurSignal = signal<UtilisateurSession | null>(this.sessionInitiale?.utilisateur ?? null);
  private readonly tokenSignal = signal<string | null>(this.sessionInitiale?.token ?? null);

  readonly utilisateur = this.utilisateurSignal.asReadonly();
  readonly estConnecte = computed(() => !!this.tokenSignal() && !!this.utilisateurSignal());
  readonly role = computed(() => this.utilisateurSignal()?.role ?? null);

  login(email: string, motDePasse: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, motDePasse }).pipe(
      tap((reponse) => {
        localStorage.setItem(TOKEN_KEY, reponse.token);
        localStorage.setItem(USER_KEY, JSON.stringify(reponse.utilisateur));
        this.tokenSignal.set(reponse.token);
        this.utilisateurSignal.set(reponse.utilisateur);
      })
    );
  }

  logout(): void {
    supprimerSessionStockee();
    this.tokenSignal.set(null);
    this.utilisateurSignal.set(null);
  }

  token(): string | null {
    const token = this.tokenSignal();
    if (!token || tokenExpire(token)) {
      this.logout();
      return null;
    }

    return token;
  }

  verifierSession(): boolean {
    return this.token() !== null && this.utilisateurSignal() !== null;
  }

  aUnRole(rolesAutorises: RoleUtilisateur[]): boolean {
    const role = this.role();
    return !!role && rolesAutorises.includes(role);
  }
}

interface SessionStockee {
  token: string;
  utilisateur: UtilisateurSession;
}

function lireSessionStockee(): SessionStockee | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || tokenExpire(token)) {
    supprimerSessionStockee();
    return null;
  }

  const utilisateur = lireUtilisateurStocke();
  if (!utilisateur) {
    supprimerSessionStockee();
    return null;
  }

  return { token, utilisateur };
}

export function lireUtilisateurStocke(): UtilisateurSession | null {
  try {
    const valeur = localStorage.getItem(USER_KEY);
    return valeur ? JSON.parse(valeur) : null;
  } catch {
    return null;
  }
}

function supprimerSessionStockee(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function decoderPayloadJwt(token: string): Record<string, unknown> | null {
  try {
    const morceau = token.split('.')[1];
    if (!morceau) {
      return null;
    }

    const base64 = morceau.replace(/-/g, '+').replace(/_/g, '/');
    const complete = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(complete)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function tokenExpire(token: string, maintenant = Date.now()): boolean {
  const payload = decoderPayloadJwt(token);
  return typeof payload?.['exp'] !== 'number' || maintenant >= payload['exp'] * 1000;
}
