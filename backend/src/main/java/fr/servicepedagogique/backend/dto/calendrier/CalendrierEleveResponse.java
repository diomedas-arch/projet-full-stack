package fr.servicepedagogique.backend.dto.calendrier;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import java.time.LocalDateTime;

public record CalendrierEleveResponse(
        String typeInscription,
        Integer idCoursPlanifie,
        String promotion,
        String codeCours,
        String titreCours,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        String salle,
        String formateur
) {

    public static CalendrierEleveResponse depuis(String typeInscription, CoursPlanifie coursPlanifie) {
        return new CalendrierEleveResponse(
                typeInscription,
                coursPlanifie.getIdCoursPlanifie(),
                coursPlanifie.getPromotion().getLibelle(),
                coursPlanifie.getCursusCours().getCours().getCode(),
                coursPlanifie.getCursusCours().getCours().getTitre(),
                coursPlanifie.getDateDebut(),
                coursPlanifie.getDateFin(),
                coursPlanifie.getSalle(),
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
