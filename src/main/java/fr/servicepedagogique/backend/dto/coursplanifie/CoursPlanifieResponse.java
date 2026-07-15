package fr.servicepedagogique.backend.dto.coursplanifie;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import java.time.LocalDateTime;

public record CoursPlanifieResponse(
        Integer idCoursPlanifie,
        Integer idPromotion,
        String libellePromotion,
        Integer idCursusCours,
        String titreCours,
        Integer idFormateur,
        String specialiteFormateur,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        String salle,
        String statut
) {
    public static CoursPlanifieResponse depuis(CoursPlanifie coursPlanifie) {
        return new CoursPlanifieResponse(
                coursPlanifie.getIdCoursPlanifie(),
                coursPlanifie.getPromotion().getIdPromotion(),
                coursPlanifie.getPromotion().getLibelle(),
                coursPlanifie.getCursusCours().getIdCursusCours(),
                coursPlanifie.getCursusCours().getCours().getTitre(),
                coursPlanifie.getFormateur() != null ? coursPlanifie.getFormateur().getIdFormateur() : null,
                coursPlanifie.getFormateur() != null ? coursPlanifie.getFormateur().getSpecialite() : null,
                coursPlanifie.getDateDebut(),
                coursPlanifie.getDateFin(),
                coursPlanifie.getSalle(),
                coursPlanifie.getStatut()
        );
    }
}