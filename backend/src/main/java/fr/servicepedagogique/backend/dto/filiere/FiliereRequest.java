package fr.servicepedagogique.backend.dto.filiere;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FiliereRequest(
        @NotBlank(message = "Le libellé de la filière est obligatoire.")
        @Size(max = 100, message = "Le libellé ne peut pas dépasser 100 caractères.")
        String libelle
) {
}
