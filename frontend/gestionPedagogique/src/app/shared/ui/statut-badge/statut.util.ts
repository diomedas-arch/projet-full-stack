export type StatutToken = 'planifie' | 'actif' | 'annule' | 'inactif';

export interface StatutAffichage {
  label: string;
  token: StatutToken;
}

const STATUTS: Record<string, StatutAffichage> = {
  PLANIFIEE: { label: 'Planifiée', token: 'planifie' },
  PLANIFIE: { label: 'Planifié', token: 'planifie' },
  EN_COURS: { label: 'En cours', token: 'actif' },
  ACTIF: { label: 'Actif', token: 'actif' },
  TERMINEE: { label: 'Terminée', token: 'inactif' },
  TERMINE: { label: 'Terminé', token: 'inactif' },
  INACTIF: { label: 'Inactif', token: 'inactif' },
  ANNULEE: { label: 'Annulée', token: 'annule' },
  ANNULE: { label: 'Annulé', token: 'annule' }
};

export function resoudreStatut(statut: string | null | undefined): StatutAffichage {
  if (!statut) {
    return { label: '—', token: 'inactif' };
  }

  return STATUTS[statut.toUpperCase()] ?? { label: statut, token: 'inactif' };
}
