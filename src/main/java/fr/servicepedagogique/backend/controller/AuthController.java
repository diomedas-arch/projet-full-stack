package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dto.auth.LoginRequest;
import fr.servicepedagogique.backend.dto.auth.LoginResponse;
import fr.servicepedagogique.backend.dto.utilisateur.UtilisateurResponse;
import fr.servicepedagogique.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim().toLowerCase(),
                        request.motDePasse()
                )
        );

        Utilisateur utilisateur = (Utilisateur) authentication.getPrincipal();
        String token = jwtService.genererToken(utilisateur);

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSecondes(),
                UtilisateurResponse.depuis(utilisateur)
        );
    }
}
