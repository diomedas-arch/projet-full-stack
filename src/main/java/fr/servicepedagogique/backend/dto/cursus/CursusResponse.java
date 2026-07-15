package fr.servicepedagogique.backend.dto.cursus;

public record CursusResponse(
        Integer idCursus,
        String titre,
        String niveau,
        Integer idFiliere,
        String libelleFiliere
) {
}
