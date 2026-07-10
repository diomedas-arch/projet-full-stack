package fr.servicepedagogique.backend.dto.utilisateur;

import fr.servicepedagogique.backend.bo.RoleUtilisateur;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ModifierUtilisateurRequest(
        @Email(message = "L'email doit être valide.")
        @Size(max = 255, message = "L'email ne doit pas dépasser 255 caractères.")
        String email,

        RoleUtilisateur role,

        StatutUtilisateur statut
) {
}
