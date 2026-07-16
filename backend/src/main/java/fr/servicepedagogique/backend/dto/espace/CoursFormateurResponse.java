package fr.servicepedagogique.backend.dto.espace;

import java.time.LocalDateTime;
import java.util.List;

public record CoursFormateurResponse(
        Integer idCoursPlanifie,
        String codeCours,
        String titreCours,
        String promotion,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        String salle,
        String statut,
        List<EleveCoursResponse> eleves
) {
}
