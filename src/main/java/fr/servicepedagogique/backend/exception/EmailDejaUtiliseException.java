package fr.servicepedagogique.backend.exception;

public class EmailDejaUtiliseException extends RuntimeException {

    public EmailDejaUtiliseException(String message) {
        super(message);
    }
}
