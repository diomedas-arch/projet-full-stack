package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.FormateurConsultationService;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dto.formateur.CoursFormateurResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/formateur")
public class FormateurController {

    private final FormateurConsultationService formateurConsultationService;

    public FormateurController(FormateurConsultationService formateurConsultationService) {
        this.formateurConsultationService = formateurConsultationService;
    }

    @GetMapping("/cours")
    public List<CoursFormateurResponse> consulterMesCours(Authentication authentication) {
        return formateurConsultationService.consulterCoursPour((Utilisateur) authentication.getPrincipal());
    }
}
