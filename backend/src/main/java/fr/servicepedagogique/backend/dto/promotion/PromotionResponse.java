package fr.servicepedagogique.backend.dto.promotion;

import fr.servicepedagogique.backend.bo.Promotion;

public record PromotionResponse(
        Integer id,
        Integer idPromotion,
        String libelle,
        String periode,
        String statut,
        Integer idCursus,
        String titreCursus,
        Integer idFiliere,
        String libelleFiliere
) {

    public static PromotionResponse depuis(Promotion promotion) {
        return new PromotionResponse(
                promotion.getIdPromotion(),
                promotion.getIdPromotion(),
                promotion.getLibelle(),
                promotion.getPeriode(),
                promotion.getStatut().name(),
                promotion.getCursus().getIdCursus(),
                promotion.getCursus().getTitre(),
                promotion.getCursus().getFiliere().getIdFiliere(),
                promotion.getCursus().getFiliere().getLibelle()
        );
    }
}
