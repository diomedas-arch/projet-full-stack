package fr.servicepedagogique.backend.dto.eleve;

import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;

public record EleveResponse(
        Integer idEleve,
        Integer idUtilisateur,
        String email,
        String numeroDossier,
        String telephone,
        StatutUtilisateur statut
) {
    public static EleveResponse depuis(Eleve eleve) {
        return new EleveResponse(
                eleve.getIdEleve(),
                eleve.getUtilisateur().getIdUtilisateur(),
                eleve.getUtilisateur().getEmail(),
                eleve.getNumeroDossier(),
                eleve.getTelephone(),
                eleve.getUtilisateur().getStatut()
        );
    }
}
