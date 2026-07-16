// TODO BACKEND MANQUANT : l'entité Formateur existe côté backend (voir
// fr.servicepedagogique.backend.bo.Formateur, marquée "placeholder" dans son
// commentaire) mais n'a aucun Service/Controller/DTO exposé. Le select "Formateur"
// du formulaire CoursPlanifie a donc besoin d'un GET /api/formateurs renvoyant
// { idFormateur, specialite } (au minimum).
//
// En attendant, cette liste STATIQUE ET TEMPORAIRE simule ces données. À supprimer
// dès que l'endpoint existe.
export interface FormateurTemporaire {
  idFormateur: number;
  specialite: string;
}

export const FORMATEUR_TEMPORAIRE: FormateurTemporaire[] = [
  { idFormateur: 1, specialite: 'Développement web' },
  { idFormateur: 2, specialite: 'Bases de données' },
  { idFormateur: 3, specialite: 'DevOps & Cloud' }
];
