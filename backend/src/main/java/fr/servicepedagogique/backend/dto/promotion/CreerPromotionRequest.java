package fr.servicepedagogique.backend.dto.promotion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreerPromotionRequest(
        @NotNull(message = "Le cursus est obligatoire.")
        Integer idCursus,

        @NotBlank(message = "Le libellé est obligatoire.")
        @Size(max = 150, message = "Le libellé ne doit pas dépasser 150 caractères.")
        String libelle,

        @NotBlank(message = "La période est obligatoire.")
        @Size(max = 100, message = "La période ne doit pas dépasser 100 caractères.")
        String periode,

        @Size(max = 20, message = "Le statut ne doit pas dépasser 20 caractères.")
        String statut
) {
}
