package fr.servicepedagogique.backend.dto.promotion;

import jakarta.validation.constraints.Size;

public record ModifierPromotionRequest(
        Integer idCursus,

        @Size(max = 150, message = "Le libellé ne doit pas dépasser 150 caractères.")
        String libelle,

        @Size(max = 100, message = "La période ne doit pas dépasser 100 caractères.")
        String periode,

        @Size(max = 20, message = "Le statut ne doit pas dépasser 20 caractères.")
        String statut
) {
}
