package fr.servicepedagogique.backend.dto.filiere;

public record FiliereResponse(
        Integer idFiliere,
        String libelle,
        long nombreCursus
) {
}
