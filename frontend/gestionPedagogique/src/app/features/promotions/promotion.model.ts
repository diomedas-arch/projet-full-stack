export interface Promotion {
  id: number;
  idPromotion?: number;
  libelle: string;
  periode: string;
  statut: string;
  idCursus: number;
  titreCursus: string;
  idFiliere?: number;
  libelleFiliere?: string;
}

export interface CoursPromotionPlanifie {
  idCoursPlanifie: number;
  idPromotion: number;
  promotion: string;
  codeCours: string;
  titreCours: string;
  ordre: number;
  dateDebut: string;
  dateFin: string;
  salle: string | null;
  statut: string;
  idFormateur: number | null;
  formateur: string | null;
}

export interface PromotionDetailData {
  promotion: Promotion;
  cours: CoursPromotionPlanifie[];
}
