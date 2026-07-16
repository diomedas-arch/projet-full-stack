package fr.servicepedagogique.backend.dto.espace;

public record EleveCoursResponse(
        Integer idEleve,
        String email,
        String numeroDossier,
        String telephone,
        String typeInscription
) {
}
