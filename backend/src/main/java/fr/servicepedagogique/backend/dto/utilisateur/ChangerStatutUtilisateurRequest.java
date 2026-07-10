package fr.servicepedagogique.backend.dto.utilisateur;

import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import jakarta.validation.constraints.NotNull;

public record ChangerStatutUtilisateurRequest(
        @NotNull(message = "Le statut est obligatoire.")
        StatutUtilisateur statut
) {
}
