package fr.servicepedagogique.backend.security;

import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.UtilisateurRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIXE_BEARER = "Bearer ";

    private final JwtService jwtService;
    private final UtilisateurRepository utilisateurRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UtilisateurRepository utilisateurRepository) {
        this.jwtService = jwtService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith(PREFIXE_BEARER)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(PREFIXE_BEARER.length());
        jwtService.lireToken(token)
                .flatMap(payload -> utilisateurRepository.findByEmail(payload.email()))
                .filter(Utilisateur::isEnabled)
                .filter(Utilisateur::isAccountNonLocked)
                .ifPresent(utilisateur -> {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            utilisateur,
                            null,
                            utilisateur.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });

        filterChain.doFilter(request, response);
    }
}
