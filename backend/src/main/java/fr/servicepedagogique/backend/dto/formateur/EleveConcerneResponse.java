package fr.servicepedagogique.backend.dto.formateur;

import fr.servicepedagogique.backend.bo.Eleve;

public record EleveConcerneResponse(
        Integer idEleve,
        String email,
        String numeroDossier,
        String telephone
) {

    public static EleveConcerneResponse depuis(Eleve eleve) {
        return new EleveConcerneResponse(
                eleve.getIdEleve(),
                eleve.getUtilisateur().getEmail(),
                eleve.getNumeroDossier(),
                eleve.getTelephone()
        );
    }
}
