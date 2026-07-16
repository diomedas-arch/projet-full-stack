export type RoleUtilisateur = 'ROLE_ELEVE' | 'ROLE_REFERENTE' | 'ROLE_FORMATEUR' | 'ROLE_ADMIN';
export type StatutUtilisateur = 'ACTIF' | 'INACTIF' | 'BLOQUE';

export interface UtilisateurSession {
  idUtilisateur: number;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
}

export interface LoginResponse {
  token: string;
  type: 'Bearer';
  expirationSecondes: number;
  utilisateur: UtilisateurSession;
}

export const ROLES_UTILISATEUR: RoleUtilisateur[] = [
  'ROLE_ELEVE',
  'ROLE_REFERENTE',
  'ROLE_FORMATEUR',
  'ROLE_ADMIN'
];

export const STATUTS_UTILISATEUR: StatutUtilisateur[] = ['ACTIF', 'INACTIF', 'BLOQUE'];

const LIBELLES_ROLES: Record<RoleUtilisateur, string> = {
  ROLE_ADMIN: 'Administrateur',
  ROLE_REFERENTE: 'Référente administrative',
  ROLE_FORMATEUR: 'Formateur',
  ROLE_ELEVE: 'Élève'
};

const LIBELLES_STATUTS: Record<StatutUtilisateur, string> = {
  ACTIF: 'Actif',
  INACTIF: 'Inactif',
  BLOQUE: 'Bloqué'
};

export function libelleRole(role: RoleUtilisateur | null | undefined): string {
  return role ? LIBELLES_ROLES[role] : 'Rôle inconnu';
}

export function libelleStatutUtilisateur(statut: StatutUtilisateur | null | undefined): string {
  return statut ? LIBELLES_STATUTS[statut] : 'Statut inconnu';
}
