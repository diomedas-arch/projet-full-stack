package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.EspacePedagogiqueService;
import fr.servicepedagogique.backend.dto.espace.CalendrierCoursResponse;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class EspacePersonnelController {

    private final EspacePedagogiqueService espacePedagogiqueService;

    public EspacePersonnelController(EspacePedagogiqueService espacePedagogiqueService) {
        this.espacePedagogiqueService = espacePedagogiqueService;
    }

    @GetMapping("/calendrier")
    public List<CalendrierCoursResponse> calendrier(Principal principal) {
        return espacePedagogiqueService.calendrierEleve(principal.getName());
    }
}
