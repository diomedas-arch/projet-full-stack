export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface UtilisateurConnecte {
  idUtilisateur: number;
  email: string;
  role: string;
  statut: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expirationSecondes: number;
  utilisateur: UtilisateurConnecte;
}
