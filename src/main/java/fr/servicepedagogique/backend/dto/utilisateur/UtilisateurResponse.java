package fr.servicepedagogique.backend.dto.utilisateur;

import fr.servicepedagogique.backend.bo.RoleUtilisateur;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import fr.servicepedagogique.backend.bo.Utilisateur;

public record UtilisateurResponse(
        Integer idUtilisateur,
        String email,
        RoleUtilisateur role,
        StatutUtilisateur statut
) {
    public static UtilisateurResponse depuis(Utilisateur utilisateur) {
        return new UtilisateurResponse(
                utilisateur.getIdUtilisateur(),
                utilisateur.getEmail(),
                utilisateur.getRole(),
                utilisateur.getStatut()
        );
    }
}
