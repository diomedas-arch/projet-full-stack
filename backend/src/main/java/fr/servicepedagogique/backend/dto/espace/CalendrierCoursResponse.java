package fr.servicepedagogique.backend.dto.espace;

import java.time.LocalDateTime;

public record CalendrierCoursResponse(
        String typeInscription,
        String promotion,
        String codeCours,
        String titreCours,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        String salle,
        String formateurSpecialite
) {
}
