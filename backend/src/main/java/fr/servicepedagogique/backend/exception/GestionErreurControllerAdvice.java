package fr.servicepedagogique.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GestionErreurControllerAdvice {

    @ExceptionHandler(RessourceIntrouvableException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError ressourceIntrouvable(RessourceIntrouvableException exception, HttpServletRequest request) {
        return ApiError.simple(HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @ExceptionHandler(EmailDejaUtiliseException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError emailDejaUtilise(EmailDejaUtiliseException exception, HttpServletRequest request) {
        return ApiError.simple(HttpStatus.CONFLICT, exception.getMessage(), request);
    }

    @ExceptionHandler(DonneeDejaExistanteException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError donneeDejaExistante(
            DonneeDejaExistanteException exception,
            HttpServletRequest request
    ) {
        return ApiError.simple(HttpStatus.CONFLICT, exception.getMessage(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError contrainteBaseDeDonnees(HttpServletRequest request) {
        return ApiError.simple(
                HttpStatus.CONFLICT,
                "Suppression impossible : cette donnée est encore utilisée ailleurs.",
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError validation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, String> details = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(erreur ->
                details.put(erreur.getField(), erreur.getDefaultMessage())
        );

        return ApiError.avecDetails(
                HttpStatus.BAD_REQUEST,
                "Certaines données envoyées sont invalides.",
                request,
                details
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError contrainte(ConstraintViolationException exception, HttpServletRequest request) {
        return ApiError.simple(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError mauvaiseRequete(IllegalArgumentException exception, HttpServletRequest request) {
        return ApiError.simple(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiError mauvaisIdentifiants(HttpServletRequest request) {
        return ApiError.simple(HttpStatus.UNAUTHORIZED, "Identifiants invalides.", request);
    }

    @ExceptionHandler({DisabledException.class, LockedException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiError compteNonAutorise(HttpServletRequest request) {
        return ApiError.simple(HttpStatus.FORBIDDEN, "Ce compte n'est pas autorisé à se connecter.", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiError nonAuthentifie(HttpServletRequest request) {
        return ApiError.simple(HttpStatus.UNAUTHORIZED, "Authentification requise.", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiError accesRefuse(HttpServletRequest request) {
        return ApiError.simple(HttpStatus.FORBIDDEN, "Droits insuffisants.", request);
    }
}
