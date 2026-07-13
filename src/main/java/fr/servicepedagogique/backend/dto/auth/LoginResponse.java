package fr.servicepedagogique.backend.dto.auth;

import fr.servicepedagogique.backend.dto.utilisateur.UtilisateurResponse;

public record LoginResponse(
        String token,
        String type,
        long expirationSecondes,
        UtilisateurResponse utilisateur
) {
}
