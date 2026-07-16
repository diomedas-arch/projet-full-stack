package fr.servicepedagogique.backend.dto.espace;

public record PromotionResponse(
        Integer idPromotion,
        String libelle,
        String periode,
        String statut,
        Integer idCursus,
        String titreCursus,
        String niveau,
        Integer idFiliere,
        String libelleFiliere
) {
}
