package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.FormateurConsultationService;
import fr.servicepedagogique.backend.dto.formateur.FormateurDisponibleResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/formateurs")
public class FormateursController {

    private final FormateurConsultationService formateurConsultationService;

    public FormateursController(FormateurConsultationService formateurConsultationService) {
        this.formateurConsultationService = formateurConsultationService;
    }

    @GetMapping
    public List<FormateurDisponibleResponse> lister(@RequestParam(required = false) Boolean actif) {
        return formateurConsultationService.listerDisponibles(actif);
    }
}
