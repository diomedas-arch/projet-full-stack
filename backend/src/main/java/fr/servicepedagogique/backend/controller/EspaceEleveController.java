package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.CalendrierEleveService;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dto.calendrier.CalendrierEleveResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class EspaceEleveController {

    private final CalendrierEleveService calendrierEleveService;

    public EspaceEleveController(CalendrierEleveService calendrierEleveService) {
        this.calendrierEleveService = calendrierEleveService;
    }

    @GetMapping({"/calendrier", "/calendar"})
    public List<CalendrierEleveResponse> consulterCalendrier(Authentication authentication) {
        return calendrierEleveService.consulterPour((Utilisateur) authentication.getPrincipal());
    }
}
