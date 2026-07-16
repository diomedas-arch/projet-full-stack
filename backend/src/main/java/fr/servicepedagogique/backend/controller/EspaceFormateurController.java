package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.EspacePedagogiqueService;
import fr.servicepedagogique.backend.dto.espace.CoursFormateurResponse;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/formateur")
public class EspaceFormateurController {

    private final EspacePedagogiqueService espacePedagogiqueService;

    public EspaceFormateurController(EspacePedagogiqueService espacePedagogiqueService) {
        this.espacePedagogiqueService = espacePedagogiqueService;
    }

    @GetMapping("/cours")
    public List<CoursFormateurResponse> listerCours(Principal principal) {
        return espacePedagogiqueService.coursDuFormateur(principal.getName());
    }
}
