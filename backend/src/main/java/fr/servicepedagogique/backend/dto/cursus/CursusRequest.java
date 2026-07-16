package fr.servicepedagogique.backend.dto.cursus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CursusRequest(
        @NotNull(message = "La filière est obligatoire.")
        @Positive(message = "La filière sélectionnée est invalide.")
        Integer idFiliere,

        @NotBlank(message = "Le titre du cursus est obligatoire.")
        @Size(max = 150, message = "Le titre ne peut pas dépasser 150 caractères.")
        String titre,

        @Size(max = 50, message = "Le niveau ne peut pas dépasser 50 caractères.")
        String niveau
) {
}
