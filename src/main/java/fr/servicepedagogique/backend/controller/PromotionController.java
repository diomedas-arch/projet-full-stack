package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.PromotionService;
import fr.servicepedagogique.backend.dto.promotion.CreerPromotionRequest;
import fr.servicepedagogique.backend.dto.promotion.ModifierPromotionRequest;
import fr.servicepedagogique.backend.dto.promotion.PromotionResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping
    public List<PromotionResponse> lister() {
        return promotionService.lister();
    }

    @GetMapping("/{idPromotion}")
    public PromotionResponse consulter(@PathVariable Integer idPromotion) {
        return promotionService.consulter(idPromotion);
    }

    @GetMapping("/cursus/{idCursus}")
    public List<PromotionResponse> listerParCursus(@PathVariable Integer idCursus) {
        return promotionService.findByCursus(idCursus);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionResponse creer(@Valid @RequestBody CreerPromotionRequest request) {
        return promotionService.creer(request);
    }

    @PutMapping("/{idPromotion}")
    public PromotionResponse modifier(
            @PathVariable Integer idPromotion,
            @Valid @RequestBody ModifierPromotionRequest request
    ) {
        return promotionService.modifier(idPromotion, request);
    }

    @DeleteMapping("/{idPromotion}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer idPromotion) {
        promotionService.supprimer(idPromotion);
    }
}