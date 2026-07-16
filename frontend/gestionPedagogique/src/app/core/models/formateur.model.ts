export interface FormateurDisponible {
  idFormateur: number;
  idUtilisateur: number | null;
  email: string | null;
  specialite: string | null;
  actif: boolean;
}
