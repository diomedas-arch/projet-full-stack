package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.PromotionConsultationService;
import fr.servicepedagogique.backend.dto.promotion.PromotionDetailResponse;
import fr.servicepedagogique.backend.dto.promotion.PromotionResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionConsultationService promotionConsultationService;

    public PromotionController(PromotionConsultationService promotionConsultationService) {
        this.promotionConsultationService = promotionConsultationService;
    }

    @GetMapping
    public List<PromotionResponse> lister() {
        return promotionConsultationService.lister();
    }

    @GetMapping("/{idPromotion}")
    public PromotionDetailResponse consulter(@PathVariable Integer idPromotion) {
        return promotionConsultationService.consulter(idPromotion);
    }
}
