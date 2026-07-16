import { RoleUtilisateur, StatutUtilisateur } from '../../core/auth/auth.model';

export interface Utilisateur {
  id: number;
  idUtilisateur: number;
  email: string;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
}
