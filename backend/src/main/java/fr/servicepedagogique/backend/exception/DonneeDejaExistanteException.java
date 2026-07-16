package fr.servicepedagogique.backend.exception;

public class DonneeDejaExistanteException extends RuntimeException {

    public DonneeDejaExistanteException(String message) {
        super(message);
    }
}
