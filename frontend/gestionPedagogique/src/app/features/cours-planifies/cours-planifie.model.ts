export interface CoursPlanifie {
  id: number;
  idPromotion: number;
  libellePromotion: string;
  idCursusCours: number;
  titreCours: string;
  idFormateur: number | null;
  specialiteFormateur: string | null;
  dateDebut: string;
  dateFin: string;
  salle: string | null;
  statut: string;
}
