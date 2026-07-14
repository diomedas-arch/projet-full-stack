package fr.servicepedagogique.backend.dto.cours;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreerCoursRequest(
        @NotBlank(message = "Le code est obligatoire.")
        @Size(max = 30, message = "Le code ne doit pas dépasser 30 caractères.")
        String code,

        @NotBlank(message = "Le titre est obligatoire.")
        @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères.")
        String titre
) {
}