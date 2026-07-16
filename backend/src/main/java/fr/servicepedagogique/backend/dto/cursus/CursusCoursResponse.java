package fr.servicepedagogique.backend.dto.cursus;

import fr.servicepedagogique.backend.bo.CursusCours;

public record CursusCoursResponse(
        Integer idCursusCours,
        Integer idCursus,
        Integer idCours,
        String codeCours,
        String titreCours,
        Integer ordre,
        String prerequis,
        boolean obligatoire
) {
    public static CursusCoursResponse depuis(CursusCours cursusCours) {
        return new CursusCoursResponse(
                cursusCours.getIdCursusCours(),
                cursusCours.getCursus().getIdCursus(),
                cursusCours.getCours().getIdCours(),
                cursusCours.getCours().getCode(),
                cursusCours.getCours().getTitre(),
                cursusCours.getOrdre(),
                cursusCours.getPrerequis(),
                cursusCours.isObligatoire()
        );
    }
}
