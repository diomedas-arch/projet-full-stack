package fr.servicepedagogique.backend.dto.cours;

import jakarta.validation.constraints.Size;

public record ModifierCoursRequest(
        @Size(max = 30, message = "Le code ne doit pas dépasser 30 caractères.")
        String code,

        @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères.")
        String titre
) {
}
