import { Injectable, computed, signal } from '@angular/core';

import { decoderPayloadJwt } from './jwt.util';

const CLE_TOKEN = 'gestion-pedagogique.auth-token';

// Seul point d'accès à localStorage pour le token — le reste de l'app (interceptor,
// guard, AuthService) passe par ce service plutôt que d'y accéder directement.
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(CLE_TOKEN));

  readonly estConnecte = computed(() => this.tokenSignal() !== null);

  // Rôle lu depuis le claim "role" du JWT — affichage uniquement, voir jwt.util.ts.
  readonly role = computed(() => {
    const token = this.tokenSignal();
    return token ? (decoderPayloadJwt(token)?.role ?? null) : null;
  });

  lire(): string | null {
    return this.tokenSignal();
  }

  ecrire(token: string): void {
    localStorage.setItem(CLE_TOKEN, token);
    this.tokenSignal.set(token);
  }

  effacer(): void {
    localStorage.removeItem(CLE_TOKEN);
    this.tokenSignal.set(null);
  }
}
