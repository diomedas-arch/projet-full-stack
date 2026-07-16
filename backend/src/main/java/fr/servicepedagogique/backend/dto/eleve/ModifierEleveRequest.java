package fr.servicepedagogique.backend.dto.eleve;

import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ModifierEleveRequest(
        @Email(message = "L'email doit être valide.")
        @Size(max = 255, message = "L'email ne doit pas dépasser 255 caractères.")
        String email,

        @Size(max = 50, message = "Le numéro de dossier ne doit pas dépasser 50 caractères.")
        String numeroDossier,

        @Size(max = 30, message = "Le téléphone ne doit pas dépasser 30 caractères.")
        String telephone,

        StatutUtilisateur statut
) {
}
