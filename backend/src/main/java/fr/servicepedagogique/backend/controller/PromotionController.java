package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.EspacePedagogiqueService;
import fr.servicepedagogique.backend.dto.espace.PromotionResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final EspacePedagogiqueService espacePedagogiqueService;

    public PromotionController(EspacePedagogiqueService espacePedagogiqueService) {
        this.espacePedagogiqueService = espacePedagogiqueService;
    }

    @GetMapping
    public List<PromotionResponse> lister() {
        return espacePedagogiqueService.listerPromotions();
    }
}
