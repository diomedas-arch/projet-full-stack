package fr.servicepedagogique.backend.dto.cours;

import fr.servicepedagogique.backend.bo.Cours;

public record CoursResponse(
        Integer id,
        Integer idCours,
        String code,
        String titre
) {

    public static CoursResponse depuis(Cours cours) {
        return new CoursResponse(
                cours.getIdCours(),
                cours.getIdCours(),
                cours.getCode(),
                cours.getTitre()
        );
    }
}
