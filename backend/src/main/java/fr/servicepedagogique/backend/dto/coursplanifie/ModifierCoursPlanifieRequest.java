package fr.servicepedagogique.backend.dto.coursplanifie;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record ModifierCoursPlanifieRequest(
        Integer idPromotion,
        Integer idCursusCours,
        Integer idFormateur,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,

        @Size(max = 100, message = "La salle ne doit pas dépasser 100 caractères.")
        String salle,

        @Size(max = 20, message = "Le statut ne doit pas dépasser 20 caractères.")
        String statut
) {
}
