package fr.servicepedagogique.backend.dto.promotion;

import fr.servicepedagogique.backend.bo.Promotion;

public record PromotionResponse(
        Integer idPromotion,
        Integer idCursus,
        String titreCursus,
        String libelle,
        String periode,
        String statut
) {
    public static PromotionResponse depuis(Promotion promotion) {
        return new PromotionResponse(
                promotion.getIdPromotion(),
                promotion.getCursus().getIdCursus(),
                promotion.getCursus().getTitre(),
                promotion.getLibelle(),
                promotion.getPeriode(),
                promotion.getStatut()
        );
    }
}