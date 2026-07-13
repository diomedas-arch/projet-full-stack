package fr.servicepedagogique.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;

public record ApiError(
        Instant timestamp,
        int status,
        String erreur,
        String message,
        String chemin,
        Map<String, String> details
) {
    public static ApiError simple(HttpStatus status, String message, HttpServletRequest request) {
        return new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                Map.of()
        );
    }

    public static ApiError avecDetails(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> details
    ) {
        return new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                details
        );
    }
}
