// TODO BACKEND MANQUANT : il n'existe à ce jour aucun endpoint pour lister les
// CursusCours (l'entité et son repository existent côté backend — voir
// fr.servicepedagogique.backend.bo.CursusCours — mais aucun Service/Controller/DTO
// ne les expose). Le select "Cours du cursus" du formulaire CoursPlanifie a donc
// besoin d'un GET (ex: /api/cursus/{idCursus}/cours ou /api/cours-planifies/cursus-cours?idCursus=)
// renvoyant { idCursusCours, idCursus, titreCours } pour chaque cursus.
//
// En attendant, cette liste STATIQUE ET TEMPORAIRE simule ces données pour que le
// formulaire reste utilisable en développement. Les idCursus ci-dessous doivent
// correspondre aux cursus réellement présents en base pour que le filtrage ait un sens.
// À supprimer dès que l'endpoint existe.
export interface CursusCoursTemporaire {
  idCursusCours: number;
  idCursus: number;
  titreCours: string;
}

export const CURSUS_COURS_TEMPORAIRE: CursusCoursTemporaire[] = [
  { idCursusCours: 1, idCursus: 1, titreCours: 'Algorithmique et structures de données' },
  { idCursusCours: 2, idCursus: 1, titreCours: 'Bases de données relationnelles' },
  { idCursusCours: 3, idCursus: 2, titreCours: 'Développement Angular avancé' },
  { idCursusCours: 4, idCursus: 2, titreCours: 'Architecture Spring Boot' }
];
