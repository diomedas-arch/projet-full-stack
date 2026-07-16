// Modèle PARTAGÉ — référencé par plusieurs features (ex: Promotion).
// Ne pas dupliquer cette interface ailleurs ; l'implémentation complète
// de la feature Cursus est gérée séparément (Sasha).
export interface Cursus {
  id: number;
  titre: string;
  niveau: string;
  idFiliere: number;
  libelleFiliere: string;
}
