interface JwtPayload {
  sub?: string;
  uid?: number;
  role?: string;
  exp?: number;
}

// Décode le payload du JWT côté client, SANS vérifier la signature — uniquement pour
// piloter l'affichage (masquer/afficher des boutons). Ce n'est pas une vérification de
// sécurité : le backend revalide systématiquement le token et le rôle à chaque requête
// protégée (SecurityConfig), quoi que ce décodage renvoie.
export function decoderPayloadJwt(token: string): JwtPayload | null {
  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}
