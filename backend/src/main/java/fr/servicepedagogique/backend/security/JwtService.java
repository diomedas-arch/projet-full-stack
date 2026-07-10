package fr.servicepedagogique.backend.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.servicepedagogique.backend.bo.Utilisateur;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final String HMAC_ALGORITHME = "HmacSHA256";

    private final ObjectMapper objectMapper;
    private final String secret;
    private final long expirationMinutes;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String genererToken(Utilisateur utilisateur) {
        Instant maintenant = Instant.now();
        Instant expiration = maintenant.plusSeconds(getExpirationSecondes());

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", utilisateur.getEmail());
        payload.put("uid", utilisateur.getIdUtilisateur());
        payload.put("role", utilisateur.getRole().name());
        payload.put("iat", maintenant.getEpochSecond());
        payload.put("exp", expiration.getEpochSecond());

        String contenu = encoderJson(header) + "." + encoderJson(payload);
        return contenu + "." + signer(contenu);
    }

    public Optional<JwtPayload> lireToken(String token) {
        try {
            String[] morceaux = token.split("\\.");
            if (morceaux.length != 3) {
                return Optional.empty();
            }

            String contenu = morceaux[0] + "." + morceaux[1];
            String signatureAttendue = signer(contenu);
            if (!MessageDigest.isEqual(
                    signatureAttendue.getBytes(StandardCharsets.UTF_8),
                    morceaux[2].getBytes(StandardCharsets.UTF_8)
            )) {
                return Optional.empty();
            }

            byte[] payloadDecode = Base64.getUrlDecoder().decode(morceaux[1]);
            Map<String, Object> payload = objectMapper.readValue(
                    payloadDecode,
                    new TypeReference<>() {
                    }
            );

            long expiration = ((Number) payload.get("exp")).longValue();
            if (Instant.now().getEpochSecond() >= expiration) {
                return Optional.empty();
            }

            return Optional.of(new JwtPayload(
                    (String) payload.get("sub"),
                    ((Number) payload.get("uid")).intValue(),
                    (String) payload.get("role")
            ));
        } catch (RuntimeException | java.io.IOException exception) {
            return Optional.empty();
        }
    }

    public long getExpirationSecondes() {
        return expirationMinutes * 60;
    }

    private String encoderJson(Map<String, Object> valeur) {
        try {
            byte[] json = objectMapper.writeValueAsBytes(valeur);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(json);
        } catch (java.io.IOException exception) {
            throw new IllegalStateException("Impossible de générer le token JWT.", exception);
        }
    }

    private String signer(String contenu) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHME);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHME));
            byte[] signature = mac.doFinal(contenu.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception exception) {
            throw new IllegalStateException("Impossible de signer le token JWT.", exception);
        }
    }

    public record JwtPayload(String email, Integer idUtilisateur, String role) {
    }
}
