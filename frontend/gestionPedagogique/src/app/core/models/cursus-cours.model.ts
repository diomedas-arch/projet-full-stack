export interface CursusCours {
  idCursusCours: number;
  idCursus: number;
  idCours: number;
  codeCours: string;
  titreCours: string;
  ordre: number;
  prerequis: string | null;
  obligatoire: boolean;
}
