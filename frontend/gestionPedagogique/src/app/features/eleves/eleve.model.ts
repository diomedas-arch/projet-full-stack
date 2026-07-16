import { StatutUtilisateur } from '../../core/auth/auth.model';

export interface Eleve {
  id: number;
  idEleve: number;
  idUtilisateur: number;
  email: string;
  numeroDossier: string;
  telephone: string | null;
  statut: StatutUtilisateur;
}
