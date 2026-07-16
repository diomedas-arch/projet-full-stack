package fr.servicepedagogique.backend.dto.coursplanifie;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreerCoursPlanifieRequest(
        @NotNull(message = "La promotion est obligatoire.")
        Integer idPromotion,

        @NotNull(message = "Le cours du cursus est obligatoire.")
        Integer idCursusCours,

        Integer idFormateur,

        @NotNull(message = "La date de début est obligatoire.")
        LocalDateTime dateDebut,

        @NotNull(message = "La date de fin est obligatoire.")
        LocalDateTime dateFin,

        @Size(max = 100, message = "La salle ne doit pas dépasser 100 caractères.")
        String salle,

        @Size(max = 20, message = "Le statut ne doit pas dépasser 20 caractères.")
        String statut
) {
}
