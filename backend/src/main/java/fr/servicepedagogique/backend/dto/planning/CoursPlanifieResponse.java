package fr.servicepedagogique.backend.dto.planning;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import java.time.LocalDateTime;

public record CoursPlanifieResponse(
        Integer idCoursPlanifie,
        Integer idPromotion,
        String promotion,
        String codeCours,
        String titreCours,
        Integer ordre,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        String salle,
        String statut,
        Integer idFormateur,
        String formateur
) {

    public static CoursPlanifieResponse depuis(CoursPlanifie coursPlanifie) {
        return new CoursPlanifieResponse(
                coursPlanifie.getIdCoursPlanifie(),
                coursPlanifie.getPromotion().getIdPromotion(),
                coursPlanifie.getPromotion().getLibelle(),
                coursPlanifie.getCursusCours().getCours().getCode(),
                coursPlanifie.getCursusCours().getCours().getTitre(),
                coursPlanifie.getCursusCours().getOrdre(),
                coursPlanifie.getDateDebut(),
                coursPlanifie.getDateFin(),
                coursPlanifie.getSalle(),
                coursPlanifie.getStatut().name(),
                coursPlanifie.getFormateur() == null ? null : coursPlanifie.getFormateur().getIdFormateur(),
                libelleFormateur(coursPlanifie)
        );
    }

    private static String libelleFormateur(CoursPlanifie coursPlanifie) {
        if (coursPlanifie.getFormateur() == null) {
            return null;
        }

        if (coursPlanifie.getFormateur().getUtilisateur() != null) {
            return coursPlanifie.getFormateur().getUtilisateur().getEmail();
        }

        return coursPlanifie.getFormateur().getSpecialite();
    }
}
