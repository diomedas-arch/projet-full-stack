package fr.servicepedagogique.backend.dto.formateur;

import fr.servicepedagogique.backend.bo.Formateur;

public record FormateurDisponibleResponse(
        Integer idFormateur,
        Integer idUtilisateur,
        String email,
        String specialite,
        boolean actif
) {
    public static FormateurDisponibleResponse depuis(Formateur formateur) {
        return new FormateurDisponibleResponse(
                formateur.getIdFormateur(),
                formateur.getUtilisateur() == null ? null : formateur.getUtilisateur().getIdUtilisateur(),
                formateur.getUtilisateur() == null ? null : formateur.getUtilisateur().getEmail(),
                formateur.getSpecialite(),
                formateur.isActif()
        );
    }
}
