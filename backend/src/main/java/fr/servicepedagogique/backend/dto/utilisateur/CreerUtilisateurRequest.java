package fr.servicepedagogique.backend.dto.utilisateur;

import fr.servicepedagogique.backend.bo.RoleUtilisateur;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreerUtilisateurRequest(
        @NotBlank(message = "L'email est obligatoire.")
        @Email(message = "L'email doit être valide.")
        @Size(max = 255, message = "L'email ne doit pas dépasser 255 caractères.")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire.")
        @Size(min = 8, max = 100, message = "Le mot de passe doit contenir entre 8 et 100 caractères.")
        String motDePasse,

        @NotNull(message = "Le rôle est obligatoire.")
        RoleUtilisateur role,

        StatutUtilisateur statut
) {
}
